import 'reflect-metadata';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { NestFactory } from '@nestjs/core';
import { portSchema } from '@aex/validation';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  if (existsSync('.env')) loadEnvFile('.env');
  const port = portSchema.parse(process.env.PORT ?? 3002);
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
  console.error('Não foi possível iniciar a API.', error instanceof Error ? error.message : '');
  process.exitCode = 1;
});
