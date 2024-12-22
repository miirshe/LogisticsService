import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliverySchema } from './schemas/delivery.schema';
import { DeliveryStatusHistorySchema } from './schemas/delivery-status-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Delivery',
        schema: DeliverySchema,
      },
      {
        name: 'DeliveryStatusHistory',
        schema: DeliveryStatusHistorySchema,
      },
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}
