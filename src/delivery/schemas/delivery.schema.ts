/* eslint-disable @typescript-eslint/no-require-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from 'src/fleet/schemas/fleet.schema';

@Schema()
export class DeliveryItem {
  @Prop()
  name: string;

  @Prop({ default: 1 })
  quantity: number;

  @Prop({ default: 0 })
  weight: number;

  @Prop({ default: false })
  fragile: boolean;
}

@Schema()
export class Meta {
  @Prop({ type: String })
  key: string;

  @Prop({ type: MongooseSchema.Types.Mixed })
  value: any;
}

@Schema({ timestamps: true })
export class Delivery extends Document {
  @Prop({ enum: ['PARCEL', 'FOOD'], default: 'PARCEL' })
  deliveryType?: string;

  @Prop({
    enum: ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  })
  deliveryStatus?: string;

  @Prop({ type: Location })
  origin?: Location;

  @Prop({ type: Location })
  destination?: Location;

  @Prop({ type: [Location], default: [] })
  waypoints?: Location[];

  @Prop()
  scheduledPickupTime?: Date;

  @Prop()
  actualDeliveryTime?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Fleet' })
  assignedFleet?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  driver?: MongooseSchema.Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  customer?: MongooseSchema.Types.ObjectId | string;

  @Prop({ type: [DeliveryItem], default: [] })
  items?: DeliveryItem[];

  @Prop({ type: [Meta], default: [] })
  meta?: Meta[];

  @Prop({ enum: ['PENDING', 'PAID', 'FAILED'], default: 'PENDING' })
  paymentStatus?: string;

  @Prop({ default: 0 })
  paymentAmount?: number;

  @Prop()
  trackingNumber?: string;

  @Prop({ default: 0 })
  deliveryAttempts?: number;

  @Prop()
  lastAttemptTime?: Date;

  @Prop()
  failureReason?: string;

  @Prop()
  notes?: string;

  @Prop()
  specialInstructions?: string;

  @Prop()
  recipientName?: string;

  @Prop()
  recipientContact?: string;

  @Prop()
  recipientEmail?: string;

  @Prop({ type: Boolean, default: false })
  insurance?: boolean;

  @Prop({ type: Number, default: 0 })
  insuranceAmount?: number;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery).plugin(
  require('mongoose-aggregate-paginate-v2'),
);
