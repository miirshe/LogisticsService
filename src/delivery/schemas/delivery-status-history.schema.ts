import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from 'src/fleet/schemas/fleet.schema';
import { Delivery } from './delivery.schema';

@Schema()
export class StatusUpdate {
  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop({ type: Location })
  location?: Location;

  @Prop()
  notes?: string;

  @Prop()
  updatedBy?: string;
}

@Schema({ timestamps: true })
export class DeliveryStatusHistory extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  deliveryId: Delivery;

  @Prop({ type: [StatusUpdate], default: [] })
  updates: StatusUpdate[];
}

export const DeliveryStatusHistorySchema = SchemaFactory.createForClass(
  DeliveryStatusHistory,
);
