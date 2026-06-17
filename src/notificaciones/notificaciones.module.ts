import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { GoogleCalendarService } from './google-calendar/google-calendar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  providers: [NotificacionesService, GoogleCalendarService],
  controllers: [NotificacionesController],
  exports: [NotificacionesService],
})
export class NotificacionesModule {}
