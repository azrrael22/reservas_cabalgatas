import { SalidaResponseDto } from '../../salidas/dto/salida-response.dto';
import { EstadoReservacion } from '../entities/reservacion.entity';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';

export class ParticipanteResponseDto {
  id: number;
  primerNombre: string;
  primerApellido: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  fechaNacimiento: string;
  alturaCm: number;
  pesoKg: string;
}

export class ReservacionResponseDto {
  id: number;
  salida: SalidaResponseDto;
  clienteId: number;
  clienteNombre: string;
  adminId: number;
  numPeople: number;
  precioUnitario: string;
  total: string;
  estado: EstadoReservacion;
  participantes: ParticipanteResponseDto[];
}
