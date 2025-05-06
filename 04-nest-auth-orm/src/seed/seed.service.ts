import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from 'src/products/products.service';
import { User } from 'src/auth/entities/user.entity';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async executeSeed() {
    await this.deleteTables();

    const user = await this.insertNewUsers();

    await this.insertNewProducts(user);

    return 'Database seeded successfully';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder('user');
    await queryBuilder.delete().execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;

    // Using forEach with async functions does not wait for the promises to resolve. This can lead to unexpected behavior. Use for...of loop instead.
    for (const user of seedUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const users = seedUsers.map((user) => this.userRepository.create(user));

    await this.userRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = products.map((product) =>
      this.productsService.create(product, user),
    );

    await Promise.all(insertPromises);

    return true;
  }
}
