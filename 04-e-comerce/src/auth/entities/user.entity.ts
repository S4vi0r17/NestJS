import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  email: string;

  password: string;

  fullName: string;

  isActive: boolean;
}
