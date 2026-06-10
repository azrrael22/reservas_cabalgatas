import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Salida } from '../../salidas/entities/salida.entity';
import { Participante } from './participante.entity';

export enum EstadoReservacion {
  RESERVADO = 'reservado',
  EN_CURSO = 'en_curso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

@Entity({ name: 'reservaciones' })
export class Reservacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Salida, { nullable: false, eager: true })
  @JoinColumn({ name: 'salida_id' })
  salida: Salida;

  @ManyToOne(() => Usuario, { nullable: true, eager: true })
  @JoinColumn({ name: 'client_id' })
  cliente: Usuario;

  @ManyToOne(() => Usuario, { nullable: true, eager: true })
  @JoinColumn({ name: 'admin_id' })
  admin: Usuario;

  @Column({ name: 'num_people', type: 'int', default: 1 })
  numPeople: number;

  @Column({ name: 'precio_unitario', type: 'numeric', precision: 10, scale: 2 })
  precioUnitario: string;

  @Column({ type: 'numeric', precision: 20, scale: 2 })
  total: string;

  @Column({ type: 'varchar', length: 50, default: EstadoReservacion.RESERVADO })
  estado: EstadoReservacion;

  @OneToMany(() => Participante, (p) => p.reservacion, {
    cascade: true,
    eager: true,
  })
  participantes: Participante[];
}
