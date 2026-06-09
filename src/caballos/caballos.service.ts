import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { CaballoDto } from './dto/caballo.dto';
import { CaballoResponseDto } from './dto/caballo-response.dto';
import { Caballo } from './entities/caballo.entity';

@Injectable()
export class CaballosService {
  constructor(
    @InjectRepository(Caballo)
    private readonly repo: Repository<Caballo>,
  ) {}

  async listar(): Promise<CaballoResponseDto[]> {
    const caballos = await this.repo.find({ where: { eliminado: false } });
    return caballos.map(CaballoResponseDto.from);
  }

  async obtener(id: number): Promise<CaballoResponseDto> {
    const caballo = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    return CaballoResponseDto.from(caballo);
  }

  async crear(dto: CaballoDto): Promise<CaballoResponseDto> {
    const caballo = this.repo.create({
      nombre: dto.nombre,
      raza: dto.raza ?? null,
      isActive: true,
      eliminado: false,
    });
    await this.repo.save(caballo);
    return CaballoResponseDto.from(caballo);
  }

  async actualizar(id: number, dto: CaballoDto): Promise<CaballoResponseDto> {
    const caballo = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    caballo.nombre = dto.nombre;
    caballo.raza = dto.raza ?? caballo.raza;
    await this.repo.save(caballo);
    return CaballoResponseDto.from(caballo);
  }

  async activar(id: number): Promise<void> {
    const caballo = await this.repo.findOne({ where: { id } });
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    if (caballo.eliminado) {
      throw new ReglaNegocioException('No se puede activar un caballo eliminado');
    }
    caballo.isActive = true;
    await this.repo.save(caballo);
  }

  async desactivar(id: number): Promise<void> {
    const caballo = await this.repo.findOne({ where: { id } });
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    if (caballo.eliminado) {
      throw new ReglaNegocioException('No se puede desactivar un caballo eliminado');
    }
    caballo.isActive = false;
    await this.repo.save(caballo);
  }

  async eliminar(id: number): Promise<void> {
    const caballo = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    caballo.eliminado = true;
    caballo.isActive = false;
    await this.repo.save(caballo);
  }
}
