import { Guia } from '../entities/guia.entity';
import { GuiaResponseDto } from '../dto/guia-response.dto';

export class GuiaMapper {
  static toResponseDto(entity: Guia): GuiaResponseDto {
    const dto = new GuiaResponseDto();
    dto.id = entity.id;
    dto.primerNombre = entity.primerNombre;
    dto.primerApellido = entity.primerApellido;
    dto.tipoDocumento = entity.tipoDocumento;
    dto.fechaNacimiento = entity.fechaNacimiento;
    dto.documento = entity.documento;
    dto.telefono = entity.telefono;
    dto.email = entity.email;
    dto.isActive = entity.isActive;
    dto.eliminado = entity.eliminado;
    return dto;
  }
}
