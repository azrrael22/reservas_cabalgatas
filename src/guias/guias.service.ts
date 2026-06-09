import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecursoNoEncontradoException } from '../common/exceptions/recurso-no-encontrado.exception';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';
import { GuiaDto } from './dto/guia.dto';
import { GuiaResponseDto } from './dto/guia-response.dto';
import { Guia } from './entities/guia.entity';

@Injectable()
export class GuiasService {
  constructor(
    @InjectRepository(Guia)
    private readonly repo: Repository<Guia>,
  ) {}

  async listar(): Promise<GuiaResponseDto[]> {
    const guias = await this.repo.find({ where: { eliminado: false } });
    return guias.map(GuiaResponseDto.from);
  }

  async obtener(id: number): Promise<GuiaResponseDto> {
    const guia = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    return GuiaResponseDto.from(guia);
  }

  async crear(dto: GuiaDto): Promise<GuiaResponseDto> {
    const guia = this.repo.create({
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
    await this.repo.save(guia);
    return GuiaResponseDto.from(guia);
  }

  async actualizar(id: number, dto: GuiaDto): Promise<GuiaResponseDto> {
    const guia = await this.repo.findOne({ where: { id, eliminado: false } });
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
    await this.repo.save(guia);
    return GuiaResponseDto.from(guia);
  }

  async activar(id: number): Promise<void> {
    const guia = await this.repo.findOne({ where: { id } });
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    if (guia.eliminado) throw new ReglaNegocioException('No se puede activar una guía eliminada');
    guia.isActive = true;
    await this.repo.save(guia);
  }

  async desactivar(id: number): Promise<void> {
    const guia = await this.repo.findOne({ where: { id } });
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    if (guia.eliminado) throw new ReglaNegocioException('No se puede desactivar una guía eliminada');
    guia.isActive = false;
    await this.repo.save(guia);
  }

  async eliminar(id: number): Promise<void> {
    const guia = await this.repo.findOne({ where: { id, eliminado: false } });
    if (!guia) throw new RecursoNoEncontradoException('Guia', id);
    guia.eliminado = true;
    guia.isActive = false;
    await this.repo.save(guia);
  }
}
