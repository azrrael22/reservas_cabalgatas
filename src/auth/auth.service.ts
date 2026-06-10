import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import {
  EstadoUsuario,
  RolUsuario,
  Usuario,
} from '../usuarios/entities/usuario.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegistroDto } from './dto/registro.dto';
import { ReglaNegocioException } from '../common/exceptions/regla-negocio.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: dto.email },
    });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const passwordValido = await bcrypt.compare(dto.password, usuario.passwordHash);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const token = this.generarToken(usuario);
    return { token, tipo: 'Bearer', rol: usuario.role, userId: usuario.id, email: usuario.email };
  }

  async registro(dto: RegistroDto): Promise<LoginResponseDto> {
    return this.crearUsuario(dto, RolUsuario.CLIENTE);
  }

  async registroAdmin(dto: RegistroDto): Promise<LoginResponseDto> {
    const existeAdmin = await this.usuarioRepo.existsBy({ role: RolUsuario.ADMIN });
    if (existeAdmin) {
      throw new ReglaNegocioException(
        'Ya existe un administrador registrado en el sistema',
      );
    }
    return this.crearUsuario(dto, RolUsuario.ADMIN);
  }

  private async crearUsuario(
    dto: RegistroDto,
    rol: RolUsuario,
  ): Promise<LoginResponseDto> {
    const emailExiste = await this.usuarioRepo.existsBy({ email: dto.email });
    if (emailExiste) {
      throw new ConflictException('El email ya está registrado');
    }
    const documentoExiste = await this.usuarioRepo.existsBy({
      documento: dto.documento,
    });
    if (documentoExiste) {
      throw new ConflictException('El documento ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const usuario = this.usuarioRepo.create({
      primerNombre: dto.primerNombre,
      primerApellido: dto.primerApellido,
      tipoDocumento: dto.tipoDocumento,
      fechaNacimiento: dto.fechaNacimiento,
      documento: dto.documento,
      email: dto.email,
      passwordHash,
      telefono: dto.telefono,
      role: rol,
      estado: EstadoUsuario.ACTIVO,
    });
    await this.usuarioRepo.save(usuario);

    const token = this.generarToken(usuario);
    return { token, tipo: 'Bearer', rol: usuario.role, userId: usuario.id, email: usuario.email };
  }

  private generarToken(usuario: Usuario): string {
    const expiresInMs = parseInt(
      this.config.get<string>('JWT_EXPIRATION_MS') ?? '86400000',
      10,
    );
    return this.jwtService.sign(
      { sub: usuario.email },
      { expiresIn: Math.floor(expiresInMs / 1000) },
    );
  }
}
