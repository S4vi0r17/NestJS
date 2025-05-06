import {
  Controller,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        // destination: './static/uploads',
        destination: (req, file, cb) => {
          cb(null, './static/products');
        },
        // filename: (req, file, cb) => {
        //   const uniqueSuffix =
        //     Date.now() + '-' + Math.round(Math.random() * 1e9);
        //   const ext = file.originalname.split('.').pop();
        //   cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
        // },
        filename: fileNamer,
      }),
    }),
  )
  uploadProductFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
          // // new FileTypeValidator({ fileType: 'image/png' }),
          // // new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg)' }),
          // new FileTypeValidator({
          //   fileType: /^image\/(png|jpg|jpeg)$/,
          // }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.filesService.uploadProductFile(file);
  }

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }
}
