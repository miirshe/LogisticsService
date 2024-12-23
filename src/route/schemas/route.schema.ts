/* eslint-disable @typescript-eslint/no-require-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Waypoint {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  address?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  sequence: number;

  @Prop()
  estimatedArrival?: string;

  @Prop()
  actualArrival?: string;
}

@Schema()
export class DeliveryStop {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Delivery',
  })
  deliveryId: string;

  @Prop({ required: true })
  status: string;

  @Prop()
  scheduledTime?: string;

  @Prop()
  actualTime?: string;

  @Prop({ type: Waypoint })
  location: Waypoint;

  @Prop()
  notes?: string;
}

@Schema()
export class RouteMetrics {
  @Prop({ default: 0 })
  fuelConsumption: number;

  @Prop({ default: 0 })
  co2Emission: number;

  @Prop({ default: 0 })
  totalStops: number;

  @Prop({ default: 0 })
  completedStops: number;

  @Prop({ default: 0 })
  efficiency: number;

  @Prop({ default: 0 })
  averageSpeed: number;
}

@Schema({ timestamps: true })
export class Route extends Document {
  @Prop({ required: true, unique: true })
  routeNumber: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Fleet' })
  fleetId?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  driverId?: string;

  @Prop({ type: [Waypoint], default: [] })
  waypoints: Waypoint[];

  @Prop({ default: 'PENDING' })
  status: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({ default: 0 })
  totalDistance: number;

  @Prop({ default: 0 })
  estimatedDuration: number;

  @Prop({ default: 0 })
  actualDuration: number;

  @Prop({ type: [DeliveryStop], default: [] })
  deliveryStops: DeliveryStop[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Delivery', default: [] })
  deliveryIds: string[];

  @Prop({ type: RouteMetrics, default: () => ({}) })
  metrics: RouteMetrics;

  @Prop({ type: Object, default: {} })
  meta: { [key: string]: string };

  @Prop()
  lastUpdated?: string;
}

export const RouteSchema = SchemaFactory.createForClass(Route).plugin(
  require('mongoose-aggregate-paginate-v2'),
);
