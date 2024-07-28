import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove non-whitelisted properties
      forbidNonWhitelisted: true, // throw an error if non-whitelisted properties are present
      // transform: true, // transform payloads to DTO instances
    }),
  );

  await app.listen(process.env.PORT);
  logger.log(`Server running on PORT: ${process.env.PORT}`);
}
bootstrap();
