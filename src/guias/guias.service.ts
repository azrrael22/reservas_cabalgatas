import { Injectable } from '@nestjs/common';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { GuiaDto } from './dto/guia.dto';
import { GuiaResponseDto } from './dto/guia-response.dto';
import { Guia } from './entities/guia.entity';
import { GuiaMapper } from './mappers/guia.mapper';
import { GuiaRepository } from './repository/guia.repository';

@Injectable()
export class GuiasService {
  constructor(private readonly repo: GuiaRepository) {}

  async listar(): Promise<GuiaResponseDto[]> {
    const guias = await this.repo.findAll();
    return guias.map(GuiaMapper.toResponseDto);
  }

  async obtener(id: number): Promise<GuiaResponseDto> {
    const guia = await this.repo.findById(id);
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    return GuiaMapper.toResponseDto(guia);
  }

  async crear(dto: GuiaDto): Promise<GuiaResponseDto> {
    const guia = Object.assign(new Guia(), {
      primerNombre: dto.primerNombre,
      primerApellido: dto.primerApellido,
      tipoDocumento: dto.tipoDocumento,
      fechaNacimiento: dto.fechaNacimiento,
      documento: dto.documento,
      telefono: dto.telefono ?? null,
      email: dto.email ?? null,
      isActive: true,
      eliminado: false,
    });
    const saved = await this.repo.save(guia);
    return GuiaMapper.toResponseDto(saved);
  }

  async actualizar(id: number, dto: GuiaDto): Promise<GuiaResponseDto> {
    const guia = await this.repo.findById(id);
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    Object.assign(guia, {
      primerNombre: dto.primerNombre,
      primerApellido: dto.primerApellido,
      tipoDocumento: dto.tipoDocumento,
      fechaNacimiento: dto.fechaNacimiento,
      documento: dto.documento,
      telefono: dto.telefono ?? guia.telefono,
      email: dto.email ?? guia.email,
    });
    const saved = await this.repo.save(guia);
    return GuiaMapper.toResponseDto(saved);
  }

  async activar(id: number): Promise<void> {
    const guia = await this.repo.findByIdIncludingDeleted(id);
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    if (guia.eliminado) throw new ReglaNegocioException('No se puede activar una guía eliminada');
    guia.isActive = true;
    await this.repo.save(guia);
  }

  async desactivar(id: number): Promise<void> {
    const guia = await this.repo.findByIdIncludingDeleted(id);
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    if (guia.eliminado) throw new ReglaNegocioException('No se puede desactivar una guía eliminada');
    guia.isActive = false;
    await this.repo.save(guia);
  }

  async eliminar(id: number): Promise<void> {
    const guia = await this.repo.findById(id);
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    guia.eliminado = true;
    guia.isActive = false;
    await this.repo.save(guia);
  }
}
