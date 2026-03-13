import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function loadLocalEnvFiles(): void {
  const envFiles = ['.env.local', '.env'];

  for (const fileName of envFiles) {
    const filePath = resolve(process.cwd(), fileName);

    if (existsSync(filePath)) {
      loadEnv({ path: filePath });
    }
  }
}

async function bootstrap() {
  loadLocalEnvFiles();

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
