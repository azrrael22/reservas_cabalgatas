import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaballosModule } from '../caballos/caballos.module';
import { GuiasModule } from '../guias/guias.module';
import { MailModule } from '../mail/mail.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { RutasModule } from '../rutas/rutas.module';
import { SalidasModule } from '../salidas/salidas.module';
import { Reservacion } from './entities/reservacion.entity';
import { Participante } from './entities/participante.entity';
import { ReservacionesController } from './reservaciones.controller';
import { ReservacionesService } from './reservaciones.service';
import { ReservacionRepository } from './repository/reservacion.repository';
import { ReservacionTypeOrmRepository } from './repository/reservacion.typeorm.repository';
import { SalidaRecursosService } from './services/salida-recursos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservacion, Participante]),
    CaballosModule,
    GuiasModule,
    MailModule,
    NotificacionesModule,
    RutasModule,
    SalidasModule,
  ],
  controllers: [ReservacionesController],
  providers: [
    ReservacionesService,
    SalidaRecursosService,
    { provide: ReservacionRepository, useClass: ReservacionTypeOrmRepository },
  ],
})
export class ReservacionesModule {}
