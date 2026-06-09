import { Injectable } from '@nestjs/common';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { RutaDto } from './dto/ruta.dto';
import { RutaResponseDto } from './dto/ruta-response.dto';
import { Ruta } from './entities/ruta.entity';
import { RutaMapper } from './mappers/ruta.mapper';
import { RutaRepository } from './repository/ruta.repository';

@Injectable()
export class RutasService {
  constructor(private readonly repo: RutaRepository) {}

  async listar(): Promise<RutaResponseDto[]> {
    const rutas = await this.repo.findAllActivas();
    return rutas.map(RutaMapper.toResponseDto);
  }

  async obtener(id: number): Promise<RutaResponseDto> {
    const ruta = await this.repo.findById(id);
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    return RutaMapper.toResponseDto(ruta);
  }

  async crear(dto: RutaDto): Promise<RutaResponseDto> {
    const ruta = Object.assign(new Ruta(), {
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      precio: String(dto.precio),
      dificultad: dto.dificultad,
      duracionMinutos: dto.duracionMinutos,
      imageUrl: dto.imageUrl ?? null,
      isActive: true,
      eliminado: false,
    });
    const saved = await this.repo.save(ruta);
    return RutaMapper.toResponseDto(saved);
  }

  async actualizar(id: number, dto: RutaDto): Promise<RutaResponseDto> {
    const ruta = await this.repo.findById(id);
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    Object.assign(ruta, {
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? ruta.descripcion,
      precio: String(dto.precio),
      dificultad: dto.dificultad,
      duracionMinutos: dto.duracionMinutos,
      imageUrl: dto.imageUrl ?? ruta.imageUrl,
    });
    const saved = await this.repo.save(ruta);
    return RutaMapper.toResponseDto(saved);
  }

  async activar(id: number): Promise<void> {
    const ruta = await this.repo.findByIdIncludingDeleted(id);
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    if (ruta.eliminado) throw new ReglaNegocioException('No se puede activar una ruta eliminada');
    ruta.isActive = true;
    await this.repo.save(ruta);
  }

  async desactivar(id: number): Promise<void> {
    const ruta = await this.repo.findByIdIncludingDeleted(id);
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    if (ruta.eliminado) throw new ReglaNegocioException('No se puede desactivar una ruta eliminada');
    ruta.isActive = false;
    await this.repo.save(ruta);
  }

  async eliminar(id: number): Promise<void> {
    const ruta = await this.repo.findById(id);
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    ruta.eliminado = true;
    ruta.isActive = false;
    await this.repo.save(ruta);
  }
}
