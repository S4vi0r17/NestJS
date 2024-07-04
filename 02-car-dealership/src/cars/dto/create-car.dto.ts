import { IsString } from 'class-validator';

export class CreateCarDto {
  @IsString()
  readonly make: string;

  @IsString()
  readonly model: string;
  readonly year: number;
}
