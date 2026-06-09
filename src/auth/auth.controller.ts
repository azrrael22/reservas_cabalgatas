import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegistroDto } from './dto/registro.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Post('registro')
  registro(@Body() dto: RegistroDto): Promise<LoginResponseDto> {
    return this.authService.registro(dto);
  }

  @Post('registro-admin')
  registroAdmin(@Body() dto: RegistroDto): Promise<LoginResponseDto> {
    return this.authService.registroAdmin(dto);
  }
}
