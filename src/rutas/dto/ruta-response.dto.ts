import { DificultadRuta } from '../entities/ruta.entity';

export class RutaResponseDto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  dificultad: DificultadRuta;
  duracionMinutos: number;
  imageUrl: string;
  isActive: boolean;
  eliminado: boolean;
}
