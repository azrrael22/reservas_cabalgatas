import { Guia } from '../entities/guia.entity';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';

export class GuiaResponseDto {
  id: number;
  primerNombre: string;
  primerApellido: string;
  tipoDocumento: TipoDocumento;
  fechaNacimiento: string;
  documento: string;
  telefono: string;
  email: string;
  isActive: boolean;
  eliminado: boolean;

  static from(g: Guia): GuiaResponseDto {
    const dto = new GuiaResponseDto();
    dto.id = g.id;
    dto.primerNombre = g.primerNombre;
    dto.primerApellido = g.primerApellido;
    dto.tipoDocumento = g.tipoDocumento;
    dto.fechaNacimiento = g.fechaNacimiento;
    dto.documento = g.documento;
    dto.telefono = g.telefono;
    dto.email = g.email;
    dto.isActive = g.isActive;
    dto.eliminado = g.eliminado;
    return dto;
  }
}
