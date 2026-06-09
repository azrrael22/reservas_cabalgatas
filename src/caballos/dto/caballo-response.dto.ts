import { Caballo } from '../entities/caballo.entity';

export class CaballoResponseDto {
  id: number;
  nombre: string;
  raza: string;
  isActive: boolean;
  eliminado: boolean;

  static from(c: Caballo): CaballoResponseDto {
    const dto = new CaballoResponseDto();
    dto.id = c.id;
    dto.nombre = c.nombre;
    dto.raza = c.raza;
    dto.isActive = c.isActive;
    dto.eliminado = c.eliminado;
    return dto;
  }
}
