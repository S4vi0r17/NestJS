import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
    description: 'Product ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-Shirt',
    description: 'Product name',
  })
  @Column({ type: 'text', unique: true })
  name: string;

  @ApiProperty({
    example: 19.99,
    description: 'Product price',
  })
  // @Column('numeric', { precision: 10, scale: 2, default: 0 })
  @Column('float', { default: 0 })
  price: number;

  @ApiProperty({
    example: 'A comfortable cotton t-shirt',
    description: 'Product description',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    example: 't-shirt',
    description: 'Product slug',
  })
  @Column({ type: 'text', unique: true })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
  })
  @Column({ type: 'int', default: 0 })
  stock: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Product sizes',
  })
  @Column({ type: 'text', array: true })
  sizes: string[];

  @ApiProperty({
    example: 'M',
    description: 'Product default size',
  })
  @Column({ type: 'text' })
  gender: string;

  @ApiProperty({
    example: ['clothing', 'fashion'],
    description: 'Product tags',
  })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
  })
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ApiProperty({
    example: {
      id: 'b1234567-89ab-cdef-0123-456789abcdef',
      email: 'juan.perez@email.com',
      fullName: 'Juan Pérez',
      roles: ['user', 'admin'],
      isActive: true,
    },
    description: 'User who owns the product',
  })
  @ManyToOne(() => User, (user) => user.products, {
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugBeforeInsert() {
    if (!this.slug) {
      this.slug = this.name;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .replaceAll('´', '');
  }

  @BeforeUpdate()
  checkSlugBeforeUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')
      .replaceAll('´', '');
  }
}
