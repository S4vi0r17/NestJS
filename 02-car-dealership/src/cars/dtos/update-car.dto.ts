import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UpdateCarDto {
  @IsString()
  @IsUUID()
  @IsOptional()
  readonly id?: string;

  @IsString()
  @IsOptional()
  readonly make?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  readonly model?: string;

  @IsNumber()
  @IsOptional()
  readonly year?: number;
}
