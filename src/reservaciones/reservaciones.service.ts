import { ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { MailService } from '../mail/mail.service';
import { RutaRepository } from '../rutas/repository/ruta.repository';
import { EstadoSalida, Salida } from '../salidas/entities/salida.entity';
import { SalidaRepository } from '../salidas/repository/salida.repository';
import { RolUsuario, Usuario } from '../usuarios/entities/usuario.entity';
import { ReservacionAdminDto } from './dto/reservacion-admin.dto';
import { ReservacionClienteDto } from './dto/reservacion-cliente.dto';
import { ReservacionResponseDto } from './dto/reservacion-response.dto';
import { ReservacionUpdateDto } from './dto/reservacion-update.dto';
import { EstadoReservacion, Reservacion } from './entities/reservacion.entity';
import { Participante } from './entities/participante.entity';
import { ReservacionMapper } from './mappers/reservacion.mapper';
import { ReservacionRepository } from './repository/reservacion.repository';
import { SalidaRecursosService } from './services/salida-recursos.service';

const CAPACIDAD_MAXIMA = 12;

@Injectable()
export class ReservacionesService {
  constructor(
    private readonly reservacionRepo: ReservacionRepository,
    private readonly rutaRepo: RutaRepository,
    private readonly salidaRepo: SalidaRepository,
    private readonly salidaRecursos: SalidaRecursosService,
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async crearComoCliente(
    dto: ReservacionClienteDto,
    clienteId: number,
  ): Promise<ReservacionResponseDto> {
    return this.crearReservacion(dto, clienteId, null);
  }

  async crearComoAdmin(
    dto: ReservacionAdminDto,
    adminId: number,
  ): Promise<ReservacionResponseDto> {
    return this.crearReservacion(dto, null, adminId);
  }

  private async crearReservacion(
    dto: ReservacionClienteDto | ReservacionAdminDto,
    clienteId: number | null,
    adminId: number | null,
  ): Promise<ReservacionResponseDto> {
    if (dto.participantes.length !== dto.numPeople) {
      throw new ReglaNegocioException(
        `El número de participantes (${dto.participantes.length}) debe coincidir con numPeople (${dto.numPeople})`,
      );
    }

    const ruta = await this.rutaRepo.findByIdActiva(dto.rutaId);
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', dto.rutaId);

    const tiempoFin = this.calcularTiempoFin(dto.tiempoInicio, ruta.duracionMinutos);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let salida = await this.salidaRepo.findProgramada(ruta.id, dto.fechaProgramada, dto.tiempoInicio);

      if (!salida) {
        salida = queryRunner.manager.create(Salida, {
          ruta,
          fechaProgramada: dto.fechaProgramada,
          tiempoInicio: dto.tiempoInicio,
          tiempoFin,
          estado: EstadoSalida.PROGRAMADO,
          caballos: [],
          guias: [],
        });
        await queryRunner.manager.save(salida);
      }

      const personasActuales = await this.reservacionRepo.sumarPersonasPorSalida(salida.id);
      if (personasActuales + dto.numPeople > CAPACIDAD_MAXIMA) {
        throw new ReglaNegocioException(
          `La salida no tiene capacidad suficiente. Disponible: ${CAPACIDAD_MAXIMA - personasActuales}, solicitado: ${dto.numPeople}`,
        );
      }

      await this.salidaRecursos.validarYAsignar(queryRunner.manager, salida, dto.numPeople);

      const cliente = clienteId
        ? await queryRunner.manager.findOne(Usuario, { where: { id: clienteId } })
        : null;
      const admin = adminId
        ? await queryRunner.manager.findOne(Usuario, { where: { id: adminId } })
        : null;

      const total = (parseFloat(ruta.precio) * dto.numPeople).toFixed(2);

      const reservacion = queryRunner.manager.create(Reservacion, {
        salida,
        cliente,
        admin,
        numPeople: dto.numPeople,
        precioUnitario: ruta.precio,
        total,
        estado: EstadoReservacion.RESERVADO,
        participantes: dto.participantes.map((p) =>
          queryRunner.manager.create(Participante, {
            primerNombre: p.primerNombre,
            primerApellido: p.primerApellido,
            tipoDocumento: p.tipoDocumento,
            documento: p.documento,
            fechaNacimiento: p.fechaNacimiento,
            alturaCm: p.alturaCm,
            pesoKg: String(p.pesoKg),
          }),
        ),
      });
      await queryRunner.manager.save(reservacion);

      await queryRunner.commitTransaction();

      return this.buscarYMapear(reservacion.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async actualizar(
    id: number,
    dto: ReservacionUpdateDto,
    usuario: Usuario,
  ): Promise<ReservacionResponseDto> {
    const reservacion = await this.reservacionRepo.findById(id);
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    this.verificarOwnershipCliente(reservacion, usuario);
    if (reservacion.estado !== EstadoReservacion.RESERVADO) {
      throw new ReglaNegocioException('Solo se pueden modificar reservaciones en estado RESERVADO');
    }
    if (dto.participantes.length !== dto.numPeople) {
      throw new ReglaNegocioException('El número de participantes debe coincidir con numPeople');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const personasActuales = await this.reservacionRepo.sumarPersonasPorSalida(
        reservacion.salida.id,
      );
      const capacidadDisponible = CAPACIDAD_MAXIMA - (personasActuales - reservacion.numPeople);
      if (dto.numPeople > capacidadDisponible) {
        throw new ReglaNegocioException(
          `Capacidad insuficiente. Disponible: ${capacidadDisponible}, solicitado: ${dto.numPeople}`,
        );
      }

      if (dto.numPeople !== reservacion.numPeople) {
        await this.salidaRecursos.reasignarRecursos(
          queryRunner.manager,
          reservacion.salida,
          dto.numPeople,
        );
      }

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Participante)
        .where('reservacion_id = :id', { id: reservacion.id })
        .execute();

      const total = (parseFloat(reservacion.precioUnitario) * dto.numPeople).toFixed(2);

      reservacion.numPeople = dto.numPeople;
      reservacion.total = total;
      reservacion.participantes = dto.participantes.map((p) =>
        queryRunner.manager.create(Participante, {
          primerNombre: p.primerNombre,
          primerApellido: p.primerApellido,
          tipoDocumento: p.tipoDocumento,
          documento: p.documento,
          fechaNacimiento: p.fechaNacimiento,
          alturaCm: p.alturaCm,
          pesoKg: String(p.pesoKg),
        }),
      );
      await queryRunner.manager.save(reservacion);

      await queryRunner.commitTransaction();
      return this.buscarYMapear(reservacion.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelar(id: number, usuario: Usuario): Promise<void> {
    const reservacion = await this.reservacionRepo.findById(id);
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    this.verificarOwnershipCliente(reservacion, usuario);
    if (reservacion.estado !== EstadoReservacion.RESERVADO) {
      throw new ReglaNegocioException('Solo se pueden cancelar reservaciones en estado RESERVADO');
    }
    reservacion.estado = EstadoReservacion.CANCELADO;
    await this.reservacionRepo.save(reservacion);
    await this.mailService.notificarCancelacionReservacion(reservacion);
  }

  async obtener(id: number, usuario: Usuario): Promise<ReservacionResponseDto> {
    const reservacion = await this.reservacionRepo.findById(id);
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    this.verificarOwnershipCliente(reservacion, usuario);
    return ReservacionMapper.toResponseDto(reservacion);
  }

  async misReservaciones(clienteId: number): Promise<ReservacionResponseDto[]> {
    const reservaciones = await this.reservacionRepo.findByCliente(clienteId);
    return reservaciones.map(ReservacionMapper.toResponseDto);
  }

  async listarTodas(): Promise<ReservacionResponseDto[]> {
    const reservaciones = await this.reservacionRepo.findAll();
    return reservaciones.map(ReservacionMapper.toResponseDto);
  }

  private async buscarYMapear(id: number): Promise<ReservacionResponseDto> {
    const reservacion = await this.reservacionRepo.findById(id);
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    return ReservacionMapper.toResponseDto(reservacion);
  }

  private verificarOwnershipCliente(reservacion: Reservacion, usuario: Usuario): void {
    if (usuario.role === RolUsuario.ADMIN) return;
    if (reservacion.cliente?.id !== usuario.id) {
      throw new ForbiddenException('No tienes permiso para acceder a esta reservación');
    }
  }

  private calcularTiempoFin(tiempoInicio: string, duracionMinutos: number): string {
    const [h, m] = tiempoInicio.split(':').map(Number);
    const totalMinutos = h * 60 + m + duracionMinutos;
    const horaFin = Math.floor(totalMinutos / 60) % 24;
    const minFin = totalMinutos % 60;
    return `${String(horaFin).padStart(2, '0')}:${String(minFin).padStart(2, '0')}:00`;
  }
}
