import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { DificultadRuta } from '../entities/ruta.entity';

export class RutaDto {
  @IsNotEmpty({ message: 'nombre no debe estar vacío' })
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber({}, { message: 'precio debe ser un número' })
  @Min(0, { message: 'precio no puede ser negativo' })
  precio: number;

  @IsEnum(DificultadRuta, { message: 'dificultad no es válida' })
  dificultad: DificultadRuta;

  @IsPositive({ message: 'duracionMinutos debe ser un número positivo' })
  duracionMinutos: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
