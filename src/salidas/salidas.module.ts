import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salida } from './entities/salida.entity';
import { SalidaCaballo } from './entities/salida-caballo.entity';
import { SalidaGuia } from './entities/salida-guia.entity';
import { SalidasController } from './salidas.controller';
import { SalidasService } from './salidas.service';
import { SalidaRepository } from './repository/salida.repository';
import { SalidaTypeOrmRepository } from './repository/salida.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Salida, SalidaCaballo, SalidaGuia])],
  controllers: [SalidasController],
  providers: [
    SalidasService,
    { provide: SalidaRepository, useClass: SalidaTypeOrmRepository },
  ],
  exports: [SalidaRepository],
})
export class SalidasModule {}
