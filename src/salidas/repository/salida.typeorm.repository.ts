import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoSalida, Salida } from '../entities/salida.entity';
import { SalidaRepository } from './salida.repository';

@Injectable()
export class SalidaTypeOrmRepository extends SalidaRepository {
  constructor(
    @InjectRepository(Salida)
    private readonly repo: Repository<Salida>,
  ) {
    super();
  }

  findAll(): Promise<Salida[]> {
    return this.repo.find({
      relations: ['ruta', 'caballos', 'caballos.caballo', 'guias', 'guias.guia'],
    });
  }

  findById(id: number): Promise<Salida | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['ruta', 'caballos', 'caballos.caballo', 'guias', 'guias.guia'],
    });
  }

  findProgramada(
    rutaId: number,
    fechaProgramada: string,
    tiempoInicio: string,
  ): Promise<Salida | null> {
    return this.repo.findOne({
      where: {
        ruta: { id: rutaId },
        fechaProgramada,
        tiempoInicio,
        estado: EstadoSalida.PROGRAMADO,
      },
    });
  }

  save(salida: Salida): Promise<Salida> {
    return this.repo.save(salida);
  }
}
