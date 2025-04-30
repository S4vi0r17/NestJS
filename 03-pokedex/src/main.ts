import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no tienen decoradores en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
      transform: true, // Convierte automáticamente los payloads a instancias de los DTOs
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos (por ejemplo, string a number)
      },
    }),
  );

  app.setGlobalPrefix('api/v2');

  await app.listen(process.env.PORT ?? 3000);

  Logger.log(
    `🚀 Application is running on: ${await app.getUrl()}`,
    'Bootstrap',
  );
}
bootstrap();
