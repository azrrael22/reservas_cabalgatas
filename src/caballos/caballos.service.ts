import { Injectable } from '@nestjs/common';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { CaballoDto } from './dto/caballo.dto';
import { CaballoResponseDto } from './dto/caballo-response.dto';
import { Caballo } from './entities/caballo.entity';
import { CaballoMapper } from './mappers/caballo.mapper';
import { CaballoRepository } from './repository/caballo.repository';

@Injectable()
export class CaballosService {
  constructor(private readonly repo: CaballoRepository) {}

  async listar(): Promise<CaballoResponseDto[]> {
    const caballos = await this.repo.findAll();
    return caballos.map(CaballoMapper.toResponseDto);
  }

  async obtener(id: number): Promise<CaballoResponseDto> {
    const caballo = await this.repo.findById(id);
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    return CaballoMapper.toResponseDto(caballo);
  }

  async crear(dto: CaballoDto): Promise<CaballoResponseDto> {
    const caballo = Object.assign(new Caballo(), {
      nombre: dto.nombre,
      raza: dto.raza ?? null,
      isActive: true,
      eliminado: false,
    });
    const saved = await this.repo.save(caballo);
    return CaballoMapper.toResponseDto(saved);
  }

  async actualizar(id: number, dto: CaballoDto): Promise<CaballoResponseDto> {
    const caballo = await this.repo.findById(id);
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    caballo.nombre = dto.nombre;
    caballo.raza = dto.raza ?? caballo.raza;
    const saved = await this.repo.save(caballo);
    return CaballoMapper.toResponseDto(saved);
  }

  async activar(id: number): Promise<void> {
    const caballo = await this.repo.findByIdIncludingDeleted(id);
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    if (caballo.eliminado) {
      throw new ReglaNegocioException('No se puede activar un caballo eliminado');
    }
    caballo.isActive = true;
    await this.repo.save(caballo);
  }

  async desactivar(id: number): Promise<void> {
    const caballo = await this.repo.findByIdIncludingDeleted(id);
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    if (caballo.eliminado) {
      throw new ReglaNegocioException('No se puede desactivar un caballo eliminado');
    }
    caballo.isActive = false;
    await this.repo.save(caballo);
  }

  async eliminar(id: number): Promise<void> {
    const caballo = await this.repo.findById(id);
    if (!caballo) throw new RecursoNoEncontradoException('Caballo', id);
    caballo.eliminado = true;
    caballo.isActive = false;
    await this.repo.save(caballo);
  }
}
