import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryModule } from './delivery/delivery.module';
import { FleetModule } from './fleet/fleet.module';
import { RouteModule } from './route/route.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { InventoryModule } from './inventory/inventory.module';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.DATABASE_URL;
        if (!uri) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        return {
          uri,
          connectionFactory: (connection: Connection) => {
            connection.on('connected', () => {
              console.log(
                '🎉🔥 MongoDB Connected Successfully to:',
                connection.db.databaseName,
              );
            });
            connection.on('error', (error) => {
              console.error('😥 MongoDB Connection Error:', error);
            });
            return connection;
          },
        };
      },
    }),
    DeliveryModule,
    FleetModule,
    RouteModule,
    WarehouseModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
