import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from 'src/fleet/schemas/fleet.schema';

@Schema()
export class DeliveryItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ default: false })
  fragile: boolean;
}

@Schema({ timestamps: true })
export class Delivery extends Document {
  @Prop({ required: true, enum: ['PARCEL', 'FOOD'] })
  deliveryType: string;

  @Prop({
    required: true,
    enum: ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
  })
  deliveryStatus: string;

  @Prop({ type: Location, required: true })
  origin: Location;

  @Prop({ type: Location, required: true })
  destination: Location;

  @Prop({ type: [Location] })
  waypoints: Location[];

  @Prop({ required: true })
  scheduledPickupTime: Date;

  @Prop()
  actualDeliveryTime: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Fleet' })
  assignedFleet: string;

  @Prop({ type: [DeliveryItem], required: true })
  items: DeliveryItem[];

  @Prop({ required: true, enum: ['PENDING', 'PAID', 'FAILED'] })
  paymentStatus: string;

  @Prop({ required: true })
  paymentAmount: number;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
