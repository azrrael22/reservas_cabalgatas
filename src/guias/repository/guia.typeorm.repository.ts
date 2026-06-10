import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guia } from '../entities/guia.entity';
import { GuiaRepository } from './guia.repository';

@Injectable()
export class GuiaTypeOrmRepository extends GuiaRepository {
  constructor(
    @InjectRepository(Guia)
    private readonly repo: Repository<Guia>,
  ) {
    super();
  }

  findAll(): Promise<Guia[]> {
    return this.repo.find({ where: { eliminado: false } });
  }

  findById(id: number): Promise<Guia | null> {
    return this.repo.findOne({ where: { id, eliminado: false } });
  }

  findByIdIncludingDeleted(id: number): Promise<Guia | null> {
    return this.repo.findOne({ where: { id } });
  }

  findDisponibles(
    salidaId: number,
    fecha: string,
    inicio: string,
    fin: string,
    cantidad: number,
  ): Promise<Guia[]> {
    return this.repo.query(
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

  save(guia: Guia): Promise<Guia> {
    return this.repo.save(guia);
  }
}
