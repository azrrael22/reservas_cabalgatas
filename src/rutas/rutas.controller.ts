import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { RutasService } from './rutas.service';
import { RutaDto } from './dto/ruta.dto';
import { RutaResponseDto } from './dto/ruta-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rutas')
export class RutasController {
  constructor(private readonly service: RutasService) {}

  @Public()
  @Get()
  listar(): Promise<RutaResponseDto[]> {
    return this.service.listar();
  }

  @Public()
  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<RutaResponseDto> {
    return this.service.obtener(id);
  }

  @Roles(RolUsuario.ADMIN)
  @Post()
  crear(@Body() dto: RutaDto): Promise<RutaResponseDto> {
    return this.service.crear(dto);
  }

  @Roles(RolUsuario.ADMIN)
  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RutaDto,
  ): Promise<RutaResponseDto> {
    return this.service.actualizar(id, dto);
  }

  @Roles(RolUsuario.ADMIN)
  @Patch(':id/activar')
  @HttpCode(HttpStatus.NO_CONTENT)
  activar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.activar(id);
  }

  @Roles(RolUsuario.ADMIN)
  @Patch(':id/desactivar')
  @HttpCode(HttpStatus.NO_CONTENT)
  desactivar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.desactivar(id);
  }

  @Roles(RolUsuario.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.eliminar(id);
  }
}
