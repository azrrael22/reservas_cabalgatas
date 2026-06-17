import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolUsuario } from '../usuarios/entities/usuario.entity';
import { NotificacionesService } from './notificaciones.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
@Controller('admin/notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post('resumen')
  @HttpCode(HttpStatus.ACCEPTED)
  async enviarResumen(@Query('dias') diasParam?: string): Promise<{ mensaje: string }> {
    const dias = Math.min(90, Math.max(1, parseInt(diasParam ?? '7') || 7));
    void this.notificacionesService.enviarNotificaciones(dias);
    return { mensaje: `Resumen de los próximos ${dias} días enviado al administrador.` };
  }
}
