import { Caballo } from '../entities/caballo.entity';

export abstract class CaballoRepository {
  abstract findAll(): Promise<Caballo[]>;
  abstract findById(id: number): Promise<Caballo | null>;
  abstract findByIdIncludingDeleted(id: number): Promise<Caballo | null>;
  abstract findDisponibles(
    salidaId: number,
    fecha: string,
    inicio: string,
    fin: string,
    cantidad: number,
  ): Promise<Caballo[]>;
  abstract save(caballo: Caballo): Promise<Caballo>;
}
