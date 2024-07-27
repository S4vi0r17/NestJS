import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('float', { default: 0 })
  price: number;

  @Column('text', { unique: true })
  slug: string;

  @Column('int', { default: 0 })
  stock: number;

  @Column('text', { array: true })
  sizes: string[];

  @Column('text')
  gender: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true, // cascade: true specifies that when a Product entity is saved, updated, or removed, the associated ProductImage entities should be automatically saved, updated, or removed.
    eager: true, // eager: true specifies that the associated ProductImage entities should be automatically loaded when querying for a Product entity.
  })
  images?: ProductImage[];

  @BeforeInsert()
  setSlug() {
    if (!this.slug) {
      this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
    }

    this.slug = this.slug.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
  }

  @BeforeUpdate()
  transformSlug() {
    this.slug = this.slug.toLowerCase().replace(/ /g, '-').replace(/'/g, '');
  }
}
