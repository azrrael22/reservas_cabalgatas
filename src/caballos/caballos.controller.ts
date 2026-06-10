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
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { CaballosService } from './caballos.service';
import { CaballoDto } from './dto/caballo.dto';
import { CaballoResponseDto } from './dto/caballo-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
@Controller('caballos')
export class CaballosController {
  constructor(private readonly service: CaballosService) {}

  @Get()
  listar(): Promise<CaballoResponseDto[]> {
    return this.service.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<CaballoResponseDto> {
    return this.service.obtener(id);
  }

  @Post()
  crear(@Body() dto: CaballoDto): Promise<CaballoResponseDto> {
    return this.service.crear(dto);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CaballoDto,
  ): Promise<CaballoResponseDto> {
    return this.service.actualizar(id, dto);
  }

  @Patch(':id/activar')
  @HttpCode(HttpStatus.NO_CONTENT)
  activar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.activar(id);
  }

  @Patch(':id/desactivar')
  @HttpCode(HttpStatus.NO_CONTENT)
  desactivar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.desactivar(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.eliminar(id);
  }
}
