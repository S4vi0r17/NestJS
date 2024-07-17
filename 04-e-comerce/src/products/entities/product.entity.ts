import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
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
