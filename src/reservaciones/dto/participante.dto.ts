import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';

export class ParticipanteDto {
  @IsNotEmpty({ message: 'primerNombre no debe estar vacío' })
  primerNombre: string;

  @IsNotEmpty({ message: 'primerApellido no debe estar vacío' })
  primerApellido: string;

  @IsEnum(TipoDocumento, { message: 'tipoDocumento no es válido' })
  tipoDocumento: TipoDocumento;

  @IsNotEmpty({ message: 'documento no debe estar vacío' })
  documento: string;

  @IsDateString({}, { message: 'fechaNacimiento debe ser YYYY-MM-DD' })
  fechaNacimiento: string;

  @IsNumber({}, { message: 'alturaCm debe ser un número' })
  @IsPositive({ message: 'alturaCm debe ser positivo' })
  alturaCm: number;

  @IsNumber({}, { message: 'pesoKg debe ser un número' })
  @IsPositive({ message: 'pesoKg debe ser positivo' })
  pesoKg: number;
}
