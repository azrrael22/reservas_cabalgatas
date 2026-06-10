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
import { GuiasService } from './guias.service';
import { GuiaDto } from './dto/guia.dto';
import { GuiaResponseDto } from './dto/guia-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
@Controller('guias')
export class GuiasController {
  constructor(private readonly service: GuiasService) {}

  @Get()
  listar(): Promise<GuiaResponseDto[]> {
    return this.service.listar();
  }

  @Get(':id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<GuiaResponseDto> {
    return this.service.obtener(id);
  }

  @Post()
  crear(@Body() dto: GuiaDto): Promise<GuiaResponseDto> {
    return this.service.crear(dto);
  }

  @Put(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GuiaDto,
  ): Promise<GuiaResponseDto> {
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
