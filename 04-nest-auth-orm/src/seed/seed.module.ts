import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductsModule } from 'src/products/products.module';
import { SeedController } from './seed.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ProductsModule, AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
