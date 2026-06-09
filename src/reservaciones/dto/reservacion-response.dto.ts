import { SalidaResponseDto } from '../../salidas/dto/salida-response.dto';
import { EstadoReservacion, Reservacion } from '../entities/reservacion.entity';
import { Participante } from '../entities/participante.entity';
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

  static from(p: Participante): ParticipanteResponseDto {
    const dto = new ParticipanteResponseDto();
    dto.id = p.id;
    dto.primerNombre = p.primerNombre;
    dto.primerApellido = p.primerApellido;
    dto.tipoDocumento = p.tipoDocumento;
    dto.documento = p.documento;
    dto.fechaNacimiento = p.fechaNacimiento;
    dto.alturaCm = p.alturaCm;
    dto.pesoKg = p.pesoKg;
    return dto;
  }
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

  static from(r: Reservacion): ReservacionResponseDto {
    const dto = new ReservacionResponseDto();
    dto.id = r.id;
    dto.salida = r.salida ? SalidaResponseDto.from(r.salida) : null;
    dto.clienteId = r.cliente?.id ?? null;
    dto.clienteNombre = r.cliente
      ? `${r.cliente.primerNombre} ${r.cliente.primerApellido}`
      : null;
    dto.adminId = r.admin?.id ?? null;
    dto.numPeople = r.numPeople;
    dto.precioUnitario = r.precioUnitario;
    dto.total = r.total;
    dto.estado = r.estado;
    dto.participantes = (r.participantes ?? []).map(ParticipanteResponseDto.from);
    return dto;
  }
}
