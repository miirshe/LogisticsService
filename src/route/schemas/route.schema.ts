import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from '../../fleet/schemas/fleet.schema';

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Delivery',
    required: true,
  })
  deliveryId: string;

  @Prop({ type: [Location], required: true })
  waypoints: Location[];

  @Prop({ type: [Location], required: true })
  optimizedRoute: Location[];

  @Prop({ required: true })
  distance: number;

  @Prop({ required: true })
  estimatedTime: number;

  @Prop({ required: true })
  trafficConditions: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route);
