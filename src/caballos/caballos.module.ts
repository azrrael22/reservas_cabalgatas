import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caballo } from './entities/caballo.entity';
import { CaballosController } from './caballos.controller';
import { CaballosService } from './caballos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Caballo])],
  controllers: [CaballosController],
  providers: [CaballosService],
  exports: [TypeOrmModule],
})
export class CaballosModule {}
