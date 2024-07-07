import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(private readonly pokemonService: PokemonService) {}

  async executeSeed() {
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=5',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const number = +segments[segments.length - 2];

      // console.log({ number, name });

      this.pokemonService.create({ number, name });
    });

    return 'Seed executed';
  }
}
