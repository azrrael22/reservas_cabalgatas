import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EstadoReservacion, Reservacion } from '../entities/reservacion.entity';
import { ReservacionRepository } from './reservacion.repository';

const RELATIONS_COMPLETAS = [
  'salida',
  'salida.ruta',
  'salida.caballos',
  'salida.caballos.caballo',
  'salida.guias',
  'salida.guias.guia',
  'cliente',
  'admin',
  'participantes',
];

@Injectable()
export class ReservacionTypeOrmRepository extends ReservacionRepository {
  constructor(
    @InjectRepository(Reservacion)
    private readonly repo: Repository<Reservacion>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  findById(id: number): Promise<Reservacion | null> {
    return this.repo.findOne({ where: { id }, relations: RELATIONS_COMPLETAS });
  }

  findByCliente(clienteId: number): Promise<Reservacion[]> {
    return this.repo.find({
      where: { cliente: { id: clienteId } },
      relations: RELATIONS_COMPLETAS,
    });
  }

  async sumarPersonasPorSalida(salidaId: number): Promise<number> {
    const result = await this.dataSource.query(
      `SELECT COALESCE(SUM(num_people), 0)::int AS total
       FROM reservaciones
       WHERE salida_id = $1 AND estado != $2`,
      [salidaId, EstadoReservacion.CANCELADO],
    );
    return result[0]?.total ?? 0;
  }

  save(reservacion: Reservacion): Promise<Reservacion> {
    return this.repo.save(reservacion);
  }
}
