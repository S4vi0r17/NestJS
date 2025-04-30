import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<Pokemon>;

@Schema()
export class Pokemon {
  @Prop({ unique: true, index: true, required: true })
  name: string;

  @Prop({ unique: true, index: true, required: true })
  number: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
