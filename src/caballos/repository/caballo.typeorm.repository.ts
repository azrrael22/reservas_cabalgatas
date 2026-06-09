import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Caballo } from '../entities/caballo.entity';
import { CaballoRepository } from './caballo.repository';

@Injectable()
export class CaballoTypeOrmRepository extends CaballoRepository {
  constructor(
    @InjectRepository(Caballo)
    private readonly repo: Repository<Caballo>,
  ) {
    super();
  }

  findAll(): Promise<Caballo[]> {
    return this.repo.find({ where: { eliminado: false } });
  }

  findById(id: number): Promise<Caballo | null> {
    return this.repo.findOne({ where: { id, eliminado: false } });
  }

  findByIdIncludingDeleted(id: number): Promise<Caballo | null> {
    return this.repo.findOne({ where: { id } });
  }

  findDisponibles(
    salidaId: number,
    fecha: string,
    inicio: string,
    fin: string,
    cantidad: number,
  ): Promise<Caballo[]> {
    return this.repo.query(
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

  save(caballo: Caballo): Promise<Caballo> {
    return this.repo.save(caballo);
  }
}
