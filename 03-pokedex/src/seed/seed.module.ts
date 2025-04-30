import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { HttpModule } from '@nestjs/axios';
import { PokemonsModule } from 'src/pokemons/pokemons.module';

@Module({
  imports: [HttpModule, PokemonsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
