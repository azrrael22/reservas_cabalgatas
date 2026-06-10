import { Ruta } from '../entities/ruta.entity';
import { RutaResponseDto } from '../dto/ruta-response.dto';

export class RutaMapper {
  static toResponseDto(entity: Ruta): RutaResponseDto {
    const dto = new RutaResponseDto();
    dto.id = entity.id;
    dto.nombre = entity.nombre;
    dto.descripcion = entity.descripcion;
    dto.precio = entity.precio;
    dto.dificultad = entity.dificultad;
    dto.duracionMinutos = entity.duracionMinutos;
    dto.imageUrl = entity.imageUrl;
    dto.isActive = entity.isActive;
    dto.eliminado = entity.eliminado;
    return dto;
  }
}
