import { IsNotEmpty, IsOptional } from 'class-validator';

export class CaballoDto {
  @IsNotEmpty({ message: 'nombre no debe estar vacío' })
  nombre: string;

  @IsOptional()
  raza?: string;
}
