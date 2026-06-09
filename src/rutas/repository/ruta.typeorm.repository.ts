import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ruta } from '../entities/ruta.entity';
import { RutaRepository } from './ruta.repository';

@Injectable()
export class RutaTypeOrmRepository extends RutaRepository {
  constructor(
    @InjectRepository(Ruta)
    private readonly repo: Repository<Ruta>,
  ) {
    super();
  }

  findAllActivas(): Promise<Ruta[]> {
    return this.repo.find({ where: { eliminado: false, isActive: true } });
  }

  findById(id: number): Promise<Ruta | null> {
    return this.repo.findOne({ where: { id, eliminado: false } });
  }

  findByIdIncludingDeleted(id: number): Promise<Ruta | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByIdActiva(id: number): Promise<Ruta | null> {
    return this.repo.findOne({ where: { id, eliminado: false, isActive: true } });
  }

  save(ruta: Ruta): Promise<Ruta> {
    return this.repo.save(ruta);
  }
}
