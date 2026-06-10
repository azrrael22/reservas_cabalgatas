import { SalidaMapper } from '../../salidas/mappers/salida.mapper';
import { ReservacionResponseDto } from '../dto/reservacion-response.dto';
import { Reservacion } from '../entities/reservacion.entity';
import { ParticipanteMapper } from './participante.mapper';

export class ReservacionMapper {
  static toResponseDto(entity: Reservacion): ReservacionResponseDto {
    const dto = new ReservacionResponseDto();
    dto.id = entity.id;
    dto.salida = entity.salida ? SalidaMapper.toResponseDto(entity.salida) : null;
    dto.clienteId = entity.cliente?.id ?? null;
    dto.clienteNombre = entity.cliente
      ? `${entity.cliente.primerNombre} ${entity.cliente.primerApellido}`
      : null;
    dto.adminId = entity.admin?.id ?? null;
    dto.numPeople = entity.numPeople;
    dto.precioUnitario = entity.precioUnitario;
    dto.total = entity.total;
    dto.estado = entity.estado;
    dto.participantes = (entity.participantes ?? []).map(
      ParticipanteMapper.toResponseDto,
    );
    return dto;
  }
}
