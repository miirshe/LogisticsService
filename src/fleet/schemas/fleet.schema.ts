import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  address: string;
}

@Schema({ timestamps: true })
export class Fleet extends Document {
  @Prop({ required: true })
  vehicleType: string;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true })
  fuelType: string;

  @Prop({ required: true })
  fuelLevel: number;

  @Prop({ required: true })
  driverName: string;

  @Prop({ required: true })
  driverContact: string;

  @Prop({ required: true })
  driverLicenseNumber: string;

  @Prop({ default: 'AVAILABLE' })
  status: string;

  @Prop()
  lastMaintenanceDate: Date;

  @Prop({ default: 0 })
  mileage: number;

  @Prop({ type: Location })
  currentLocation: Location;
}

export const FleetSchema = SchemaFactory.createForClass(Fleet);
