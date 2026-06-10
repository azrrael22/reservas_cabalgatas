import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caballo } from './entities/caballo.entity';
import { CaballosController } from './caballos.controller';
import { CaballosService } from './caballos.service';
import { CaballoRepository } from './repository/caballo.repository';
import { CaballoTypeOrmRepository } from './repository/caballo.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Caballo])],
  controllers: [CaballosController],
  providers: [
    CaballosService,
    { provide: CaballoRepository, useClass: CaballoTypeOrmRepository },
  ],
  exports: [CaballoRepository],
})
export class CaballosModule {}
