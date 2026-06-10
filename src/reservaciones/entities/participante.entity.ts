import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoDocumento } from '../../usuarios/entities/usuario.entity';
import { Reservacion } from './reservacion.entity';

@Entity({ name: 'participantes' })
export class Participante {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Reservacion, (r) => r.participantes, { nullable: false })
  @JoinColumn({ name: 'reservacion_id' })
  reservacion: Reservacion;

  @Column({ name: 'primer_nombre', length: 100 })
  primerNombre: string;

  @Column({ name: 'primer_apellido', length: 100 })
  primerApellido: string;

  @Column({ name: 'tipo_documento', type: 'varchar', length: 20 })
  tipoDocumento: TipoDocumento;

  @Column({ length: 50 })
  documento: string;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: string;

  @Column({ name: 'altura_cm', type: 'smallint' })
  alturaCm: number;

  @Column({ name: 'peso_kg', type: 'numeric', precision: 5, scale: 2 })
  pesoKg: string;
}
