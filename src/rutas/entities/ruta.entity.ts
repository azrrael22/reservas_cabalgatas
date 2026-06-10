import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DificultadRuta {
  FACIL = 'FACIL',
  MEDIA = 'MEDIA',
  DIFICIL = 'DIFICIL',
}

@Entity({ name: 'rutas' })
export class Ruta {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio: string;

  @Column({ type: 'varchar', length: 100 })
  dificultad: DificultadRuta;

  @Column({ name: 'duracion_minutos', type: 'int' })
  duracionMinutos: number;

  @Column({ name: 'image_url', length: 500, nullable: true })
  imageUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ default: false })
  eliminado: boolean;
}
