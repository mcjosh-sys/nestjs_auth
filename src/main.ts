import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const port = process.env.APP_LISTEN_PORT ?? 3000;
  const host = process.env.APP_LISTEN_HOST;

  await app.listen(port, host);
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap:', err);
});
