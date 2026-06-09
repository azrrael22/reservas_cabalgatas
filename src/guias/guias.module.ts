import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guia } from './entities/guia.entity';
import { GuiasController } from './guias.controller';
import { GuiasService } from './guias.service';
import { GuiaRepository } from './repository/guia.repository';
import { GuiaTypeOrmRepository } from './repository/guia.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Guia])],
  controllers: [GuiasController],
  providers: [
    GuiasService,
    { provide: GuiaRepository, useClass: GuiaTypeOrmRepository },
  ],
  exports: [GuiaRepository],
})
export class GuiasModule {}
