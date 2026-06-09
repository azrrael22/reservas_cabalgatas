import { CaballoMapper } from '../../caballos/mappers/caballo.mapper';
import { GuiaMapper } from '../../guias/mappers/guia.mapper';
import { RutaMapper } from '../../rutas/mappers/ruta.mapper';
import { SalidaResponseDto } from '../dto/salida-response.dto';
import { Salida } from '../entities/salida.entity';

export class SalidaMapper {
  static toResponseDto(entity: Salida): SalidaResponseDto {
    const dto = new SalidaResponseDto();
    dto.id = entity.id;
    dto.ruta = entity.ruta ? RutaMapper.toResponseDto(entity.ruta) : null;
    dto.fechaProgramada = entity.fechaProgramada;
    dto.tiempoInicio = entity.tiempoInicio;
    dto.tiempoFin = entity.tiempoFin;
    dto.estado = entity.estado;
    dto.caballos = (entity.caballos ?? []).map((sc) =>
      CaballoMapper.toResponseDto(sc.caballo),
    );
    dto.guias = (entity.guias ?? []).map((sg) =>
      GuiaMapper.toResponseDto(sg.guia),
    );
    return dto;
  }
}
