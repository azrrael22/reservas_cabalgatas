import {
  Body,
  Controller,
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
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolUsuario, Usuario } from '../usuarios/entities/usuario.entity';
import { ReservacionesService } from './reservaciones.service';
import { ReservacionClienteDto } from './dto/reservacion-cliente.dto';
import { ReservacionAdminDto } from './dto/reservacion-admin.dto';
import { ReservacionUpdateDto } from './dto/reservacion-update.dto';
import { ReservacionResponseDto } from './dto/reservacion-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class ReservacionesController {
  constructor(private readonly service: ReservacionesService) {}

  @Post('reservaciones')
  crearComoCliente(
    @Body() dto: ReservacionClienteDto,
    @CurrentUser() usuario: Usuario,
  ): Promise<ReservacionResponseDto> {
    return this.service.crearComoCliente(dto, usuario.id);
  }

  @Roles(RolUsuario.ADMIN)
  @Post('admin/reservaciones')
  crearComoAdmin(
    @Body() dto: ReservacionAdminDto,
    @CurrentUser() usuario: Usuario,
  ): Promise<ReservacionResponseDto> {
    return this.service.crearComoAdmin(dto, usuario.id);
  }

  @Put('reservaciones/:id')
  actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReservacionUpdateDto,
    @CurrentUser() usuario: Usuario,
  ): Promise<ReservacionResponseDto> {
    return this.service.actualizar(id, dto, usuario.id);
  }

  @Patch('reservaciones/:id/cancelar')
  @HttpCode(HttpStatus.NO_CONTENT)
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() usuario: Usuario,
  ): Promise<void> {
    return this.service.cancelar(id, usuario.id);
  }

  @Get('reservaciones/mis-reservas')
  misReservaciones(
    @CurrentUser() usuario: Usuario,
  ): Promise<ReservacionResponseDto[]> {
    return this.service.misReservaciones(usuario.id);
  }

  @Get('reservaciones/:id')
  obtener(@Param('id', ParseIntPipe) id: number): Promise<ReservacionResponseDto> {
    return this.service.obtener(id);
  }
}
