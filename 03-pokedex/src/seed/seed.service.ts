import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon, PokemonDocument } from 'src/pokemons/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { PokeapiResponse } from './interfaces/pokeapi-response.interface';

@Injectable()
export class SeedService {
  constructor(
    private readonly httpService: AxiosAdapter,
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
  ) {}
  async executeSeed() {
    // Elimina completamente la colección 'pokemons' de la base de datos (incluye documentos e índices)
    // await this.pokemonModel.collection.drop();
    // Elimina el índice llamado 'no_1' de la colección (si existe)
    // await this.pokemonModel.collection.dropIndex('no_1');
    await this.pokemonModel.deleteMany({}).exec();

    const data = await this.httpService.get<PokeapiResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const storedPokemons: Pokemon[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const number = +segments[segments.length - 2];

      storedPokemons.push({ name, number });
    });

    await this.pokemonModel.insertMany(storedPokemons);

    return { message: 'Seed executed successfully' };
  }
}
