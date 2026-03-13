import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  const port = Number(
    process.env.USER_SERVICE_PORT ?? process.env.PORT ?? 5000,
  );

  await app.listen(port);
  console.log(`REST API запущен на http://localhost:${port}`);
}

void bootstrap();
