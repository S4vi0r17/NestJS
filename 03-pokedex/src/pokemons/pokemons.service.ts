import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon, PokemonDocument } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>,
    private readonly configService: ConfigService,
  ) {
    console.log(configService.get<number>('DEFAULT_LIMIT'));
    console.log(typeof configService.get<number>('DEFAULT_LIMIT'));
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase().trim();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel
      .find({})
      .skip(offset)
      .limit(limit)
      .sort({ number: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: PokemonDocument | null = null;

    // Si `term` es un número válido y no negativo
    if (!isNaN(+term) && +term > 0) {
      pokemon = await this.pokemonModel.findOne({ number: term });
    }

    // MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or number "${term}" not found`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
    }

    try {
      // new: true para que devuelva el documento actualizado
      // new solo funciona en `finfOneAndUpdate` y `findByIdAndUpdate`
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    // Diferencia entre findByIdAndDelete y deleteOne:
    // - findByIdAndDelete(id): elimina por _id y retorna el documento eliminado (o null si no existe).
    // - deleteOne({ _id: id }): elimina por filtro, retorna info de la operación (deletedCount), NO retorna el documento eliminado.
    // Usa findByIdAndDelete si necesitas el documento eliminado, deleteOne si solo te importa eliminarlo.
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const result = await this.pokemonModel.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id "${id}" not found`);
    }

    return result;
  }

  private hasCode(
    error: unknown,
  ): error is { code: number; keyValue?: { [key: string]: any } } {
    return typeof error === 'object' && error !== null && 'code' in error;
  }

  private handleException(error: unknown) {
    if (this.hasCode(error) && error.code === 11000) {
      throw new BadRequestException(
        `Pokemon with name ${error.keyValue?.name ?? 'unknown'} already exists`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
