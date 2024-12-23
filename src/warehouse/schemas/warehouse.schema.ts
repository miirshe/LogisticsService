/* eslint-disable @typescript-eslint/no-require-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  postalCode?: string;
}

@Schema({ timestamps: true })
export class Warehouse extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({ default: 'ACTIVE' })
  status: string;

  @Prop({ type: [String], default: [] })
  managers: string[];

  @Prop()
  lastUpdated?: string;

  @Prop({ type: Object, default: {} })
  meta: { [key: string]: string };
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse).plugin(
  require('mongoose-aggregate-paginate-v2'),
);
