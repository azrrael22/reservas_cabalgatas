import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Caballo } from '../../caballos/entities/caballo.entity';
import { Salida } from './salida.entity';

@Entity({ name: 'salida_caballos' })
export class SalidaCaballo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Salida, (s) => s.caballos, { nullable: false })
  @JoinColumn({ name: 'salida_id' })
  salida: Salida;

  @ManyToOne(() => Caballo, { nullable: false, eager: true })
  @JoinColumn({ name: 'horse_id' })
  caballo: Caballo;
}
