import { Participante } from '../entities/participante.entity';
import { ParticipanteResponseDto } from '../dto/reservacion-response.dto';

export class ParticipanteMapper {
  static toResponseDto(entity: Participante): ParticipanteResponseDto {
    const dto = new ParticipanteResponseDto();
    dto.id = entity.id;
    dto.primerNombre = entity.primerNombre;
    dto.primerApellido = entity.primerApellido;
    dto.tipoDocumento = entity.tipoDocumento;
    dto.documento = entity.documento;
    dto.fechaNacimiento = entity.fechaNacimiento;
    dto.alturaCm = entity.alturaCm;
    dto.pesoKg = entity.pesoKg;
    return dto;
  }
}
