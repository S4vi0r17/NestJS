import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'T-shirt',
    description: 'Product name',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiPropertyOptional({
    example: 19.99,
    description: 'Product price',
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({
    example: 'men',
    description: 'Product gender',
    enum: ['men', 'woman', 'kid', 'unisex'],
  })
  @IsIn(['men', 'woman', 'kid', 'unisex'])
  gender: string;

  @ApiPropertyOptional({
    example: 'A comfortable cotton t-shirt',
    description: 'Product description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 't-shirt-cotton',
    description: 'Product slug',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Product stock',
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['S', 'M', 'L'],
    description: 'Available sizes',
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiPropertyOptional({
    example: ['summer', 'cotton'],
    description: 'Product tags',
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    example: ['image1.jpg', 'image2.jpg'],
    description: 'Product images',
    isArray: true,
    type: String,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[];
}
