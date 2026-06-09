import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum RolUsuario {
  CLIENTE = 'CLIENTE',
  ADMIN = 'ADMIN',
}

export enum EstadoUsuario {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export enum TipoDocumento {
  CEDULA = 'CEDULA',
  PASAPORTE = 'PASAPORTE',
  CEDULA_EXTRANJERIA = 'CEDULA_EXTRANJERIA',
  TARJETA_IDENTIDAD = 'TARJETA_IDENTIDAD',
}

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'primer_nombre', length: 100 })
  primerNombre: string;

  @Column({ name: 'primer_apellido', length: 100 })
  primerApellido: string;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 20 })
  tipoDocumento: TipoDocumento;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: string;

  @Column({ length: 50, unique: true })
  documento: string;

  @Column({ length: 200, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 20, default: RolUsuario.CLIENTE })
  role: RolUsuario;

  @Column({ type: 'varchar', length: 10, default: EstadoUsuario.ACTIVO })
  estado: EstadoUsuario;
}
