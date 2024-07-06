import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const createdPokemon = await this.pokemonModel.create(createPokemonDto);
      return createdPokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists ${JSON.stringify(error.keyValue)}`,
        );
      } else {
        throw new InternalServerErrorException(
          'An error occurred. Please try again',
        );
      }
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(pokemonIdentifier: string) {
    let pokemon: Pokemon;

    // Number
    if (!isNaN(+pokemonIdentifier)) {
      pokemon = await this.pokemonModel.findOne({ number: pokemonIdentifier });
    }

    // MongoId
    if (isValidObjectId(pokemonIdentifier)) {
      pokemon = await this.pokemonModel.findById(pokemonIdentifier);
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: pokemonIdentifier.toLowerCase(),
      });
    }

    if (!pokemon)
      throw new BadRequestException(`Pokemon ${pokemonIdentifier} not found`);

    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
