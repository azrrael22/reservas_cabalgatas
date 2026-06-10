import {
  ArrayMinSize,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ParticipanteDto } from './participante.dto';

export class ReservacionAdminDto {
  @IsNumber({}, { message: 'rutaId debe ser un número' })
  rutaId: number;

  @IsDateString({}, { message: 'fechaProgramada debe ser YYYY-MM-DD' })
  fechaProgramada: string;

  @IsNotEmpty({ message: 'tiempoInicio no debe estar vacío' })
  tiempoInicio: string;

  @IsNumber({}, { message: 'numPeople debe ser un número' })
  @IsPositive({ message: 'numPeople debe ser positivo' })
  numPeople: number;

  @ArrayMinSize(1, { message: 'participantes debe tener al menos 1 elemento' })
  @ValidateNested({ each: true })
  @Type(() => ParticipanteDto)
  participantes: ParticipanteDto[];
}
