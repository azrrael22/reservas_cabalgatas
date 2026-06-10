import { Salida } from '../entities/salida.entity';
import { EstadoSalida } from '../entities/salida.entity';

export abstract class SalidaRepository {
  abstract findAll(): Promise<Salida[]>;
  abstract findById(id: number): Promise<Salida | null>;
  abstract findProgramada(
    rutaId: number,
    fechaProgramada: string,
    tiempoInicio: string,
  ): Promise<Salida | null>;
  abstract save(salida: Salida): Promise<Salida>;
}
