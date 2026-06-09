import { Guia } from '../entities/guia.entity';

export abstract class GuiaRepository {
  abstract findAll(): Promise<Guia[]>;
  abstract findById(id: number): Promise<Guia | null>;
  abstract findByIdIncludingDeleted(id: number): Promise<Guia | null>;
  abstract findDisponibles(
    salidaId: number,
    fecha: string,
    inicio: string,
    fin: string,
    cantidad: number,
  ): Promise<Guia[]>;
  abstract save(guia: Guia): Promise<Guia>;
}
