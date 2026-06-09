import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';

@Entity({ name: 'guias' })
export class Guia {
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

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: false })
  eliminado: boolean;
}
