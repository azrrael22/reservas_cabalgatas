import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salida } from './entities/salida.entity';
import { SalidaCaballo } from './entities/salida-caballo.entity';
import { SalidaGuia } from './entities/salida-guia.entity';
import { Reservacion } from '../reservaciones/entities/reservacion.entity';
import { SalidasController } from './salidas.controller';
import { SalidasService } from './salidas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salida, SalidaCaballo, SalidaGuia, Reservacion]),
  ],
  controllers: [SalidasController],
  providers: [SalidasService],
  exports: [TypeOrmModule, SalidasService],
})
export class SalidasModule {}
