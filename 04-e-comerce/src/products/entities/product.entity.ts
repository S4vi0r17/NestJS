import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text', { unique: true })
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}
