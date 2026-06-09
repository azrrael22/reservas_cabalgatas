import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { SalidasService } from './salidas.service';
import { SalidaResponseDto } from './dto/salida-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('salidas')
export class SalidasController {
  constructor(private readonly service: SalidasService) {}

  @Public()
  @Get()
  listar(): Promise<SalidaResponseDto[]> {
    return this.service.listar();
  }

  @Public()
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<SalidaResponseDto> {
    return this.service.obtener(id);
  }

  @Roles(RolUsuario.ADMIN)
  @Patch(':id/cancelar')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.cancelar(id);
  }
}
