import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtio/pagination.dto';
import { validate as validateUuid } from 'uuid';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        // Add any relations you want to load
        // 'relationName': true,
      },
    });

    return products.map((product) => ({
      ...product,
      images: product.images?.map((image) => image.url),
    }));
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
        .leftJoinAndSelect('prod.images', 'images')
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

  async findOnePlain(id: string) {
    const product = await this.findOne(id);
    return {
      ...product,
      images: product.images?.map((image) => image.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    // Update images
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        // Delete old images
        await queryRunner.manager.delete(ProductImage, {
          product: { id },
        });

        // Add new images
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDbExceptions(error);
    } finally {
      await queryRunner.release();
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
