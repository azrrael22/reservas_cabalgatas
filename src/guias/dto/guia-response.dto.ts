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
}
