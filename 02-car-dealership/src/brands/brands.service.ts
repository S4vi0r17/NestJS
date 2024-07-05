import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as u } from 'uuid';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { Brand } from './entities/brand.entity';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
    // {
    //   id: u(),
    //   name: 'Brand 1',
    //   createdAt: new Date(),
    // },
    // {
    //   id: u(),
    //   name: 'Brand 2',
    //   createdAt: new Date(),
    // },
    // {
    //   id: u(),
    //   name: 'Brand 3',
    //   createdAt: new Date(),
    // },
  ];

  create(createBrandDto: CreateBrandDto) {
    const brand: Brand = {
      id: u(),
      name: createBrandDto.name,
      createdAt: new Date(),
    };

    this.brands.push(brand);

    return brand;
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find((brand) => brand.id === id);
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    const brandDB = this.findOne(id);

    this.brands = this.brands.map((brand) => {
      if (brand.id === id) {
        brandDB.updatedAt = new Date();
        return {
          ...brandDB,
          ...updateBrandDto,
        };
      }
      return brand;
    });

    return brandDB;
  }

  remove(id: string) {
    this.brands = this.brands.filter((brand) => brand.id !== id);
  }
}
