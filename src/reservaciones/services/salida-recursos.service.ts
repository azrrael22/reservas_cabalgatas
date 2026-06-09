import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CaballoRepository } from '../../caballos/repository/caballo.repository';
import { GuiaRepository } from '../../guias/repository/guia.repository';
import { ReglaNegocioException } from '../../common/exceptions/regla-negocio.exception';
import { SalidaCaballo } from '../../salidas/entities/salida-caballo.entity';
import { SalidaGuia } from '../../salidas/entities/salida-guia.entity';
import { Salida } from '../../salidas/entities/salida.entity';

@Injectable()
export class SalidaRecursosService {
  constructor(
    private readonly caballoRepo: CaballoRepository,
    private readonly guiaRepo: GuiaRepository,
  ) {}

  calcularRecursosNecesarios(numPeople: number): { guias: number; caballos: number } {
    const guias = numPeople > 8 ? 2 : 1;
    return { guias, caballos: numPeople + guias };
  }

  async validarYAsignar(
    manager: EntityManager,
    salida: Salida,
    numPeople: number,
  ): Promise<void> {
    const { guias: guiasN, caballos: caballosN } =
      this.calcularRecursosNecesarios(numPeople);

    const caballos = await this.caballoRepo.findDisponibles(
      salida.id,
      salida.fechaProgramada,
      salida.tiempoInicio,
      salida.tiempoFin,
      caballosN,
    );
    if (caballos.length < caballosN) {
      throw new ReglaNegocioException(
        `No hay suficientes caballos disponibles. Necesarios: ${caballosN}, disponibles: ${caballos.length}`,
      );
    }

    const guias = await this.guiaRepo.findDisponibles(
      salida.id,
      salida.fechaProgramada,
      salida.tiempoInicio,
      salida.tiempoFin,
      guiasN,
    );
    if (guias.length < guiasN) {
      throw new ReglaNegocioException(
        `No hay suficientes guías disponibles. Necesarios: ${guiasN}, disponibles: ${guias.length}`,
      );
    }

    for (const caballo of caballos) {
      await manager.save(manager.create(SalidaCaballo, { salida, caballo }));
    }
    for (const guia of guias) {
      await manager.save(manager.create(SalidaGuia, { salida, guia }));
    }
  }

  async reasignarRecursos(
    manager: EntityManager,
    salida: Salida,
    numPeople: number,
  ): Promise<void> {
    await manager
      .createQueryBuilder()
      .delete()
      .from(SalidaCaballo)
      .where('salida_id = :id', { id: salida.id })
      .execute();
    await manager
      .createQueryBuilder()
      .delete()
      .from(SalidaGuia)
      .where('salida_id = :id', { id: salida.id })
      .execute();

    await this.validarYAsignar(manager, salida, numPeople);
  }
}
