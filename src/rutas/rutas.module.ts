import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ruta } from './entities/ruta.entity';
import { RutasController } from './rutas.controller';
import { RutasService } from './rutas.service';
import { RutaRepository } from './repository/ruta.repository';
import { RutaTypeOrmRepository } from './repository/ruta.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ruta])],
  controllers: [RutasController],
  providers: [
    RutasService,
    { provide: RutaRepository, useClass: RutaTypeOrmRepository },
  ],
  exports: [RutaRepository],
})
export class RutasModule {}
