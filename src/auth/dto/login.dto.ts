import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  @IsNotEmpty({ message: 'email no debe estar vacío' })
  email: string;

  @IsNotEmpty({ message: 'password no debe estar vacío' })
  password: string;
}
