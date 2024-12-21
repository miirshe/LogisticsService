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
        package: 'logistics',
        protoPath: join(__dirname, '../proto/logistics.proto'),
        url: process.env.GRPC_URL || 'localhost:50051',
      },
    },
  );

  await app.listen();
  console.log('Logistics Microservice is listening on gRPC');
}

bootstrap();
