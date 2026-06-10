import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
  IsDateString,
} from 'class-validator';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';

export class RegistroDto {
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

  @IsEmail({}, { message: 'email debe ser un correo válido' })
  email: string;

  @MinLength(8, { message: 'password debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'password no debe estar vacío' })
  password: string;

  @Matches(/^\+\d{7,15}$/, {
    message: 'telefono debe incluir indicativo internacional (ej: +571111111221)',
  })
  telefono: string;
}
