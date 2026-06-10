import { CaballoResponseDto } from '../../caballos/dto/caballo-response.dto';
import { GuiaResponseDto } from '../../guias/dto/guia-response.dto';
import { RutaResponseDto } from '../../rutas/dto/ruta-response.dto';
import { EstadoSalida } from '../entities/salida.entity';

export class SalidaResponseDto {
  id: number;
  ruta: RutaResponseDto;
  fechaProgramada: string;
  tiempoInicio: string;
  tiempoFin: string;
  estado: EstadoSalida;
  caballos: CaballoResponseDto[];
  guias: GuiaResponseDto[];
}
