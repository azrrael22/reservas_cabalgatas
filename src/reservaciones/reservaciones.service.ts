import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { Caballo } from '../caballos/entities/caballo.entity';
import { Guia } from '../guias/entities/guia.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { SalidaCaballo } from '../salidas/entities/salida-caballo.entity';
import { SalidaGuia } from '../salidas/entities/salida-guia.entity';
import { EstadoSalida, Salida } from '../salidas/entities/salida.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { ReservacionAdminDto } from './dto/reservacion-admin.dto';
import { ReservacionClienteDto } from './dto/reservacion-cliente.dto';
import { ReservacionUpdateDto } from './dto/reservacion-update.dto';
import { ReservacionResponseDto } from './dto/reservacion-response.dto';
import { EstadoReservacion, Reservacion } from './entities/reservacion.entity';
import { Participante } from './entities/participante.entity';

const CAPACIDAD_MAXIMA = 12;

@Injectable()
export class ReservacionesService {
  constructor(
    @InjectRepository(Reservacion)
    private readonly reservacionRepo: Repository<Reservacion>,
    @InjectRepository(Ruta)
    private readonly rutaRepo: Repository<Ruta>,
    @InjectRepository(Salida)
    private readonly salidaRepo: Repository<Salida>,
    @InjectRepository(Caballo)
    private readonly caballoRepo: Repository<Caballo>,
    @InjectRepository(Guia)
    private readonly guiaRepo: Repository<Guia>,
    private readonly dataSource: DataSource,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ruta = await queryRunner.manager.findOne(Ruta, {
        where: { id: dto.rutaId, eliminado: false, isActive: true },
      });
      if (!ruta) throw new RecursoNoEncontradoException('Ruta', dto.rutaId);

      const tiempoFin = this.calcularTiempoFin(dto.tiempoInicio, ruta.duracionMinutos);

      let salida = await queryRunner.manager.findOne(Salida, {
        where: {
          ruta: { id: ruta.id },
          fechaProgramada: dto.fechaProgramada,
          tiempoInicio: dto.tiempoInicio,
          estado: EstadoSalida.PROGRAMADO,
        },
      });

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

      // Validar capacidad
      const personasActuales = await this.sumarPersonasPorSalida(
        queryRunner.manager,
        salida.id,
      );
      if (personasActuales + dto.numPeople > CAPACIDAD_MAXIMA) {
        throw new ReglaNegocioException(
          `La salida no tiene capacidad suficiente. Disponible: ${CAPACIDAD_MAXIMA - personasActuales}, solicitado: ${dto.numPeople}`,
        );
      }

      // Calcular recursos necesarios
      const guiasNecesarios = dto.numPeople > 8 ? 2 : 1;
      const caballosNecesarios = dto.numPeople + guiasNecesarios;

      // Obtener recursos disponibles
      const caballos = await this.findCaballosDisponibles(
        salida.id,
        dto.fechaProgramada,
        dto.tiempoInicio,
        tiempoFin,
        caballosNecesarios,
      );
      if (caballos.length < caballosNecesarios) {
        throw new ReglaNegocioException(
          `No hay suficientes caballos disponibles. Necesarios: ${caballosNecesarios}, disponibles: ${caballos.length}`,
        );
      }

      const guias = await this.findGuiasDisponibles(
        salida.id,
        dto.fechaProgramada,
        dto.tiempoInicio,
        tiempoFin,
        guiasNecesarios,
      );
      if (guias.length < guiasNecesarios) {
        throw new ReglaNegocioException(
          `No hay suficientes guías disponibles. Necesarios: ${guiasNecesarios}, disponibles: ${guias.length}`,
        );
      }

      // Asignar caballos y guías a la salida
      for (const caballo of caballos) {
        const sc = queryRunner.manager.create(SalidaCaballo, { salida, caballo });
        await queryRunner.manager.save(sc);
      }
      for (const guia of guias) {
        const sg = queryRunner.manager.create(SalidaGuia, { salida, guia });
        await queryRunner.manager.save(sg);
      }

      // Crear la reservación
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

      return this.obtener(reservacion.id);
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
    clienteId: number,
  ): Promise<ReservacionResponseDto> {
    const reservacion = await this.reservacionRepo.findOne({
      where: { id },
      relations: ['salida', 'salida.ruta', 'cliente', 'participantes'],
    });
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    if (reservacion.cliente?.id !== clienteId) {
      throw new ForbiddenException('No tienes permiso para modificar esta reservación');
    }
    if (reservacion.estado !== EstadoReservacion.RESERVADO) {
      throw new ReglaNegocioException(
        'Solo se pueden modificar reservaciones en estado RESERVADO',
      );
    }
    if (dto.participantes.length !== dto.numPeople) {
      throw new ReglaNegocioException(
        `El número de participantes debe coincidir con numPeople`,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validar nueva capacidad (excluir las personas actuales de esta reservación)
      const personasActuales = await this.sumarPersonasPorSalida(
        queryRunner.manager,
        reservacion.salida.id,
      );
      const capacidadDisponible =
        CAPACIDAD_MAXIMA - (personasActuales - reservacion.numPeople);

      if (dto.numPeople > capacidadDisponible) {
        throw new ReglaNegocioException(
          `Capacidad insuficiente. Disponible: ${capacidadDisponible}, solicitado: ${dto.numPeople}`,
        );
      }

      // Si cambió el número de personas, reasignar recursos en la salida
      if (dto.numPeople !== reservacion.numPeople) {
        const guiasNecesarios = dto.numPeople > 8 ? 2 : 1;
        const caballosNecesarios = dto.numPeople + guiasNecesarios;

        const caballos = await this.findCaballosDisponibles(
          reservacion.salida.id,
          reservacion.salida.fechaProgramada,
          reservacion.salida.tiempoInicio,
          reservacion.salida.tiempoFin,
          caballosNecesarios,
        );
        if (caballos.length < caballosNecesarios) {
          throw new ReglaNegocioException(
            `No hay suficientes caballos disponibles para la nueva cantidad`,
          );
        }
        const guias = await this.findGuiasDisponibles(
          reservacion.salida.id,
          reservacion.salida.fechaProgramada,
          reservacion.salida.tiempoInicio,
          reservacion.salida.tiempoFin,
          guiasNecesarios,
        );
        if (guias.length < guiasNecesarios) {
          throw new ReglaNegocioException(
            `No hay suficientes guías disponibles para la nueva cantidad`,
          );
        }

        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(SalidaCaballo)
          .where('salida_id = :id', { id: reservacion.salida.id })
          .execute();
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(SalidaGuia)
          .where('salida_id = :id', { id: reservacion.salida.id })
          .execute();

        for (const c of caballos) {
          await queryRunner.manager.save(
            queryRunner.manager.create(SalidaCaballo, {
              salida: reservacion.salida,
              caballo: c,
            }),
          );
        }
        for (const g of guias) {
          await queryRunner.manager.save(
            queryRunner.manager.create(SalidaGuia, {
              salida: reservacion.salida,
              guia: g,
            }),
          );
        }
      }

      // Reemplazar participantes
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(Participante)
        .where('reservacion_id = :id', { id: reservacion.id })
        .execute();

      const total = (
        parseFloat(reservacion.precioUnitario) * dto.numPeople
      ).toFixed(2);

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
      return this.obtener(reservacion.id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelar(id: number, clienteId: number): Promise<void> {
    const reservacion = await this.reservacionRepo.findOne({
      where: { id },
      relations: ['cliente'],
    });
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    if (reservacion.cliente?.id !== clienteId) {
      throw new ForbiddenException('No tienes permiso para cancelar esta reservación');
    }
    if (reservacion.estado !== EstadoReservacion.RESERVADO) {
      throw new ReglaNegocioException(
        'Solo se pueden cancelar reservaciones en estado RESERVADO',
      );
    }
    reservacion.estado = EstadoReservacion.CANCELADO;
    await this.reservacionRepo.save(reservacion);
  }

  async obtener(id: number): Promise<ReservacionResponseDto> {
    const reservacion = await this.reservacionRepo.findOne({
      where: { id },
      relations: [
        'salida',
        'salida.ruta',
        'salida.caballos',
        'salida.caballos.caballo',
        'salida.guias',
        'salida.guias.guia',
        'cliente',
        'admin',
        'participantes',
      ],
    });
    if (!reservacion) throw new RecursoNoEncontradoException('Reservacion', id);
    return ReservacionResponseDto.from(reservacion);
  }

  async misReservaciones(clienteId: number): Promise<ReservacionResponseDto[]> {
    const reservaciones = await this.reservacionRepo.find({
      where: { cliente: { id: clienteId } },
      relations: [
        'salida',
        'salida.ruta',
        'salida.caballos',
        'salida.caballos.caballo',
        'salida.guias',
        'salida.guias.guia',
        'cliente',
        'admin',
        'participantes',
      ],
    });
    return reservaciones.map(ReservacionResponseDto.from);
  }

  private async sumarPersonasPorSalida(
    manager: any,
    salidaId: number,
  ): Promise<number> {
    const result = await manager.query(
      `SELECT COALESCE(SUM(num_people), 0)::int AS total
       FROM reservaciones
       WHERE salida_id = $1 AND estado != $2`,
      [salidaId, EstadoReservacion.CANCELADO],
    );
    return result[0]?.total ?? 0;
  }

  private async findCaballosDisponibles(
    salidaId: number,
    fecha: string,
    inicio: string,
    fin: string,
    cantidad: number,
  ): Promise<Caballo[]> {
    return this.caballoRepo.query(
      `SELECT c.* FROM caballos c
       WHERE c.is_active = true AND c.eliminado = false
       AND c.id NOT IN (
         SELECT sc.horse_id FROM salida_caballos sc WHERE sc.salida_id = $1
       )
       AND c.id NOT IN (
         SELECT sc2.horse_id FROM salida_caballos sc2
         JOIN salidas s2 ON sc2.salida_id = s2.id
         WHERE s2.fecha_programada = $2
           AND s2.estado != 'cancelado'
           AND s2.id != $1
           AND NOT (s2.tiempo_fin <= $3 OR s2.tiempo_inicio >= $4)
       )
       LIMIT $5`,
      [salidaId, fecha, inicio, fin, cantidad],
    );
  }

  private async findGuiasDisponibles(
    salidaId: number,
    fecha: string,
    inicio: string,
    fin: string,
    cantidad: number,
  ): Promise<Guia[]> {
    return this.guiaRepo.query(
      `SELECT g.* FROM guias g
       WHERE g.is_active = true AND g.eliminado = false
       AND g.id NOT IN (
         SELECT sg.guia_id FROM salida_guias sg WHERE sg.salida_id = $1
       )
       AND g.id NOT IN (
         SELECT sg2.guia_id FROM salida_guias sg2
         JOIN salidas s2 ON sg2.salida_id = s2.id
         WHERE s2.fecha_programada = $2
           AND s2.estado != 'cancelado'
           AND s2.id != $1
           AND NOT (s2.tiempo_fin <= $3 OR s2.tiempo_inicio >= $4)
       )
       LIMIT $5`,
      [salidaId, fecha, inicio, fin, cantidad],
    );
  }

  private calcularTiempoFin(tiempoInicio: string, duracionMinutos: number): string {
    const [h, m] = tiempoInicio.split(':').map(Number);
    const totalMinutos = h * 60 + m + duracionMinutos;
    const horaFin = Math.floor(totalMinutos / 60) % 24;
    const minFin = totalMinutos % 60;
    return `${String(horaFin).padStart(2, '0')}:${String(minFin).padStart(2, '0')}:00`;
  }
}
