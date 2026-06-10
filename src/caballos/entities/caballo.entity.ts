import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'caballos' })
export class Caballo {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, nullable: true })
  raza: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: false })
  eliminado: boolean;
}
