import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ruta } from '../../rutas/entities/ruta.entity';
import { SalidaCaballo } from './salida-caballo.entity';
import { SalidaGuia } from './salida-guia.entity';

export enum EstadoSalida {
  PROGRAMADO = 'programado',
  EN_CURSO = 'en_curso',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

@Entity({ name: 'salidas' })
export class Salida {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Ruta, { nullable: false, eager: false })
  @JoinColumn({ name: 'ruta_id' })
  ruta: Ruta;

  @Column({ name: 'fecha_programada', type: 'date' })
  fechaProgramada: string;

  @Column({ name: 'tiempo_inicio', type: 'time' })
  tiempoInicio: string;

  @Column({ name: 'tiempo_fin', type: 'time' })
  tiempoFin: string;

  @Column({ type: 'varchar', length: 50, default: EstadoSalida.PROGRAMADO })
  estado: EstadoSalida;

  @OneToMany(() => SalidaCaballo, (sc) => sc.salida, {
    cascade: true,
    eager: true,
  })
  caballos: SalidaCaballo[];

  @OneToMany(() => SalidaGuia, (sg) => sg.salida, {
    cascade: true,
    eager: true,
  })
  guias: SalidaGuia[];
}
