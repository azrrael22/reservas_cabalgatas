import { CaballoResponseDto } from '../../caballos/dto/caballo-response.dto';
import { GuiaResponseDto } from '../../guias/dto/guia-response.dto';
import { RutaResponseDto } from '../../rutas/dto/ruta-response.dto';
import { EstadoSalida, Salida } from '../entities/salida.entity';

export class SalidaResponseDto {
  id: number;
  ruta: RutaResponseDto;
  fechaProgramada: string;
  tiempoInicio: string;
  tiempoFin: string;
  estado: EstadoSalida;
  caballos: CaballoResponseDto[];
  guias: GuiaResponseDto[];

  static from(s: Salida): SalidaResponseDto {
    const dto = new SalidaResponseDto();
    dto.id = s.id;
    dto.ruta = s.ruta ? RutaResponseDto.from(s.ruta) : null;
    dto.fechaProgramada = s.fechaProgramada;
    dto.tiempoInicio = s.tiempoInicio;
    dto.tiempoFin = s.tiempoFin;
    dto.estado = s.estado;
    dto.caballos = (s.caballos ?? []).map((sc) => CaballoResponseDto.from(sc.caballo));
    dto.guias = (s.guias ?? []).map((sg) => GuiaResponseDto.from(sg.guia));
    return dto;
  }
}
