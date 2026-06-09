import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservacion } from './entities/reservacion.entity';
import { Participante } from './entities/participante.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { SalidaCaballo } from '../salidas/entities/salida-caballo.entity';
import { SalidaGuia } from '../salidas/entities/salida-guia.entity';
import { Caballo } from '../caballos/entities/caballo.entity';
import { Guia } from '../guias/entities/guia.entity';
import { Ruta } from '../rutas/entities/ruta.entity';
import { ReservacionesController } from './reservaciones.controller';
import { ReservacionesService } from './reservaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reservacion,
      Participante,
      Salida,
      SalidaCaballo,
      SalidaGuia,
      Caballo,
      Guia,
      Ruta,
    ]),
  ],
  controllers: [ReservacionesController],
  providers: [ReservacionesService],
})
export class ReservacionesModule {}
