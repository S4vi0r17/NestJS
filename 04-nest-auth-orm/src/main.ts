import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Store API - NestJS, TypeORM & JWT')
    .setDescription(
      'RESTful API for product management, JWT authentication, file handling, and database seeding.\n\n**Resources:**\n- Products\n- Files\n- Auth\n- Seed',
    )
    .addTag('Products', 'Product operations')
    .addTag('Files', 'File and image handling')
    .addTag('Auth', 'Authentication and users')
    .addTag('Seed', 'Database seeding')
    .setVersion('1.0.0')
    .setContact(
      'Gustavo Benites',
      'https://portfolio-gbp.vercel.app/',
      'gbp17@outlook.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  Logger.log(
    `🚀 Application is running on: ${await app.getUrl()}`,
    'Bootstrap',
  );
}
bootstrap();
