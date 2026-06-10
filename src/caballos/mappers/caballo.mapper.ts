import { Caballo } from '../entities/caballo.entity';
import { CaballoResponseDto } from '../dto/caballo-response.dto';

export class CaballoMapper {
  static toResponseDto(entity: Caballo): CaballoResponseDto {
    const dto = new CaballoResponseDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.raza = entity.raza;
    dto.isActive = entity.isActive;
    dto.eliminado = entity.eliminado;
    return dto;
  }
}
