import { Product } from '../../products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  fullName: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  product: Product;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  emailToLowerCaseOnUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
