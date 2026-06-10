import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';

export class GuiaDto {
  @IsNotEmpty({ message: 'primerNombre no debe estar vacío' })
  primerNombre: string;

  @IsNotEmpty({ message: 'primerApellido no debe estar vacío' })
  primerApellido: string;

  @IsEnum(TipoDocumento, { message: 'tipoDocumento no es válido' })
  tipoDocumento: TipoDocumento;

  @IsDateString({}, { message: 'fechaNacimiento debe ser una fecha válida (YYYY-MM-DD)' })
  fechaNacimiento: string;

  @IsNotEmpty({ message: 'documento no debe estar vacío' })
  documento: string;

  @IsOptional()
  @Matches(/^\+\d{7,15}$/, {
    message: 'telefono debe incluir indicativo internacional',
  })
  telefono?: string;

  @IsOptional()
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  email?: string;
}
