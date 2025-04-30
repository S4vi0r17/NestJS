import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PokemonsModule } from 'src/pokemons/pokemons.module';
import { CommonModule } from 'src/common/common.module';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [HttpModule, PokemonsModule, CommonModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
