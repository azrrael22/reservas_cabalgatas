import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { RutaDto } from './dto/ruta.dto';
import { RutaResponseDto } from './dto/ruta-response.dto';
import { Ruta } from './entities/ruta.entity';

@Injectable()
export class RutasService {
  constructor(
    @InjectRepository(Ruta)
    private readonly repo: Repository<Ruta>,
  ) {}

  async listar(): Promise<RutaResponseDto[]> {
    const rutas = await this.repo.find({
      where: { eliminado: false, isActive: true },
    });
    return rutas.map(RutaResponseDto.from);
  }

  async obtener(id: number): Promise<RutaResponseDto> {
    const ruta = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    return RutaResponseDto.from(ruta);
  }

  async crear(dto: RutaDto): Promise<RutaResponseDto> {
    const ruta = this.repo.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? null,
      precio: String(dto.precio),
      dificultad: dto.dificultad,
      duracionMinutos: dto.duracionMinutos,
      imageUrl: dto.imageUrl ?? null,
      isActive: true,
      eliminado: false,
    });
    await this.repo.save(ruta);
    return RutaResponseDto.from(ruta);
  }

  async actualizar(id: number, dto: RutaDto): Promise<RutaResponseDto> {
    const ruta = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    Object.assign(ruta, {
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? ruta.descripcion,
      precio: String(dto.precio),
      dificultad: dto.dificultad,
      duracionMinutos: dto.duracionMinutos,
      imageUrl: dto.imageUrl ?? ruta.imageUrl,
    });
    await this.repo.save(ruta);
    return RutaResponseDto.from(ruta);
  }

  async activar(id: number): Promise<void> {
    const ruta = await this.repo.findOne({ where: { id } });
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    if (ruta.eliminado) throw new ReglaNegocioException('No se puede activar una ruta eliminada');
    ruta.isActive = true;
    await this.repo.save(ruta);
  }

  async desactivar(id: number): Promise<void> {
    const ruta = await this.repo.findOne({ where: { id } });
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    if (ruta.eliminado) throw new ReglaNegocioException('No se puede desactivar una ruta eliminada');
    ruta.isActive = false;
    await this.repo.save(ruta);
  }

  async eliminar(id: number): Promise<void> {
    const ruta = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!ruta) throw new RecursoNoEncontradoException('Ruta', id);
    ruta.eliminado = true;
    ruta.isActive = false;
    await this.repo.save(ruta);
  }
}
