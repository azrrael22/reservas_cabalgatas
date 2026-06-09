import { Ruta } from '../entities/ruta.entity';

export abstract class RutaRepository {
  abstract findAllActivas(): Promise<Ruta[]>;
  abstract findById(id: number): Promise<Ruta | null>;
  abstract findByIdIncludingDeleted(id: number): Promise<Ruta | null>;
  abstract findByIdActiva(id: number): Promise<Ruta | null>;
  abstract save(ruta: Ruta): Promise<Ruta>;
}
