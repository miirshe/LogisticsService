import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [
          'logistics',
          'delivery',
          'fleet',
          'warehouse',
          'inventory',
          'route',
        ],
        protoPath: [
          join(__dirname, '..', 'proto', 'logistics.proto'),
          join(__dirname, '..', 'proto', 'delivery.proto'),
          join(__dirname, '..', 'proto', 'fleet.proto'),
          join(__dirname, '..', 'proto', 'warehouse.proto'),
          join(__dirname, '..', 'proto', 'inventory.proto'),
          join(__dirname, '..', 'proto', 'route.proto'),
        ],
        url: process.env.GRPC_URL,
      },
    },
  );

  await app.listen();
  console.log(
    '🚀 Logistics Microservice is listening on:',
    process.env.GRPC_URL,
  );
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
