import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { EstadoReservacion, Reservacion } from '../reservaciones/entities/reservacion.entity';
import { SalidaResponseDto } from './dto/salida-response.dto';
import { EstadoSalida, Salida } from './entities/salida.entity';

@Injectable()
export class SalidasService {
  constructor(
    @InjectRepository(Salida)
    private readonly salidaRepo: Repository<Salida>,
    @InjectRepository(Reservacion)
    private readonly reservacionRepo: Repository<Reservacion>,
    private readonly dataSource: DataSource,
  ) {}

  async listar(): Promise<SalidaResponseDto[]> {
    const salidas = await this.salidaRepo.find({
      relations: ['ruta', 'caballos', 'caballos.caballo', 'guias', 'guias.guia'],
    });
    return salidas.map(SalidaResponseDto.from);
  }

  async obtener(id: number): Promise<SalidaResponseDto> {
    const salida = await this.salidaRepo.findOne({
      where: { id },
      relations: ['ruta', 'caballos', 'caballos.caballo', 'guias', 'guias.guia'],
    });
    if (!salida) throw new RecursoNoEncontradoException('Salida', id);
    return SalidaResponseDto.from(salida);
  }

  async cancelar(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const salida = await queryRunner.manager.findOne(Salida, {
        where: { id },
      });
      if (!salida) throw new RecursoNoEncontradoException('Salida', id);
      if (salida.estado === EstadoSalida.CANCELADO) {
        throw new ReglaNegocioException('La salida ya está cancelada');
      }
      if (salida.estado === EstadoSalida.COMPLETADO) {
        throw new ReglaNegocioException('No se puede cancelar una salida completada');
      }

      salida.estado = EstadoSalida.CANCELADO;
      await queryRunner.manager.save(salida);

      await queryRunner.manager
        .createQueryBuilder()
        .update(Reservacion)
        .set({ estado: EstadoReservacion.CANCELADO })
        .where('salida_id = :id', { id })
        .andWhere('estado != :cancelado', { cancelado: EstadoReservacion.CANCELADO })
        .execute();

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
