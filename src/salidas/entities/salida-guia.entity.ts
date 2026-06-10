import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Guia } from '../../guias/entities/guia.entity';
import { Salida } from './salida.entity';

@Entity({ name: 'salida_guias' })
export class SalidaGuia {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Salida, (s) => s.guias, { nullable: false })
  @JoinColumn({ name: 'salida_id' })
  salida: Salida;

  @ManyToOne(() => Guia, { nullable: false, eager: true })
  @JoinColumn({ name: 'guia_id' })
  guia: Guia;
}
