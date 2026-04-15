// src/main.ts

import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // App híbrida: HTTP + microservicio TCP
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 3001 },
  });

  await app.startAllMicroservices();
  await app.listen(3000); // ← HTTP en puerto 3000 para Postman

  console.log('HTTP corriendo en http://localhost:3000');
  console.log('TCP corriendo en port 3001');
  console.log('>>> DATABASE_URL:', process.env.DATABASE_URL);
}

bootstrap();
