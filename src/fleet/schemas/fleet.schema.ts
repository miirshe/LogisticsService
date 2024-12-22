/* eslint-disable @typescript-eslint/no-require-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop()
  address?: string;

  @Prop()
  timestamp?: string;
}

@Schema()
export class MaintenanceRecord {
  @Prop()
  type: string;

  @Prop()
  description: string;

  @Prop()
  date: string;

  @Prop()
  status: string;

  @Prop()
  cost: number;

  @Prop()
  technician: string;

  @Prop()
  notes: string;
}

@Schema({ timestamps: true })
export class Fleet extends Document {
  // Vehicle Type Info
  @Prop({ required: true })
  vehicleType: string;

  @Prop({ required: true })
  fleetType: string;

  @Prop({ required: true, unique: true })
  licensePlate: string;

  @Prop({ required: true, unique: true })
  registrationNumber: string;

  // Vehicle Details
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  manufacturer: string;

  @Prop({ required: true })
  modelName: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  capacity: number;

  // Fuel Information
  @Prop({ required: true })
  fuelType: string;

  @Prop({ required: true, min: 0, max: 100 })
  fuelLevel: number;

  // Driver Information
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  driverId?: string;

  @Prop()
  driverName?: string;

  @Prop()
  driverContact?: string;

  @Prop()
  driverLicenseNumber?: string;

  // Status and Tracking
  @Prop({ default: 'AVAILABLE' })
  status: string;

  @Prop()
  lastMaintenanceDate?: string;

  @Prop({ default: 0 })
  mileage: number;

  @Prop({ type: Location })
  currentLocation?: Location;

  // Maintenance Records
  @Prop({ type: [MaintenanceRecord], default: [] })
  maintenanceRecords: MaintenanceRecord[];

  @Prop()
  lastUpdated?: string;

  @Prop({ type: Map, of: String })
  meta?: Map<string, string>;
}

export const FleetSchema = SchemaFactory.createForClass(Fleet).plugin(
  require('mongoose-aggregate-paginate-v2'),
);
