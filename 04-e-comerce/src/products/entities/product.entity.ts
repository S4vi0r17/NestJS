import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text', { unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('numeric', { precision: 5, scale: 2, default: 0 })
  price: number;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;
}
