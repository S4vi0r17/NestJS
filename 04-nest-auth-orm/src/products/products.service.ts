import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtio/pagination.dto';
import { validate as validateUuid } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      return await this.productRepository.save(product);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        // Add any relations you want to load
        // 'relationName': true,
      },
    });
  }

  async findOne(term: string) {
    let product: Product | null = null;

    // Search by id
    if (validateUuid(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // Search by slug or name
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(prod.name) = :name OR prod.slug = :slug', {
          name: term.toUpperCase(),
          slug: term,
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    try {
      return this.productRepository.save(product);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    // const product = await this.findOne(id);
    // await this.productRepository.remove(product);
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new BadRequestException(`Product with id ${id} not found`);
    }

    return result;
  }

  private handleDbExceptions(error: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === '23505') {
      this.logger.error('Product already exists');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Product with ${error.detail}`);
    }
    this.logger.error('Error creating product', error);
    throw new BadRequestException('Error creating product');
  }
}
