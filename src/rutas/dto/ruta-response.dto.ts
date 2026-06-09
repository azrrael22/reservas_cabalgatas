import { Ruta } from '../entities/ruta.entity';
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

  static from(r: Ruta): RutaResponseDto {
    const dto = new RutaResponseDto();
    dto.id = r.id;
    dto.nombre = r.nombre;
    dto.descripcion = r.descripcion;
    dto.precio = r.precio;
    dto.dificultad = r.dificultad;
    dto.duracionMinutos = r.duracionMinutos;
    dto.imageUrl = r.imageUrl;
    dto.isActive = r.isActive;
    dto.eliminado = r.eliminado;
    return dto;
  }
}
