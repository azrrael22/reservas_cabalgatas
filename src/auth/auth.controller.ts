import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegistroDto } from './dto/registro.dto';
import { Public } from './decorators/public.decorator';

const AUTH_THROTTLE = { default: { ttl: 60000, limit: 5 } };

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(AUTH_THROTTLE)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(dto);
  }

  @Post('registro')
  registro(@Body() dto: RegistroDto): Promise<LoginResponseDto> {
    return this.authService.registro(dto);
  }

  @Throttle(AUTH_THROTTLE)
  @Post('registro-admin')
  registroAdmin(@Body() dto: RegistroDto): Promise<LoginResponseDto> {
    return this.authService.registroAdmin(dto);
  }
}
