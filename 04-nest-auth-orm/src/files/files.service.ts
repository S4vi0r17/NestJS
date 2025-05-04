import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  constructor(private readonly configService: ConfigService) {}

  uploadProductFile(file: Express.Multer.File) {
    const hostUrl =
      this.configService.get<string>('HOST_URL') || 'http://localhost:3000';

    return {
      secureUrl: `${hostUrl}/api/files/product/${file.filename}`,
    };
  }

  getStaticProductImage(imageName: string) {
    // const path = join(__dirname, '..', '..', 'static', 'products', imageName);
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(
        `Product image with the name ${imageName} was not found.`,
      );
    }

    return path;
  }
}
