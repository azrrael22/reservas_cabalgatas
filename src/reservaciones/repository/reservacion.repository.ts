import { Reservacion } from '../entities/reservacion.entity';

export abstract class ReservacionRepository {
  abstract findById(id: number): Promise<Reservacion | null>;
  abstract findByCliente(clienteId: number): Promise<Reservacion[]>;
  abstract sumarPersonasPorSalida(salidaId: number): Promise<number>;
  abstract save(reservacion: Reservacion): Promise<Reservacion>;
}
