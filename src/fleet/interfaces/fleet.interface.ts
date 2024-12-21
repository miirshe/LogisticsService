import { Document } from 'mongoose';

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Fleet extends Document {
  vehicleType: string;
  licensePlate: string;
  make: string;
  modelName: string;
  year: number;
  capacity: number;
  fuelType: string;
  fuelLevel: number;
  driverName: string;
  driverContact: string;
  driverLicenseNumber: string;
  status: string;
  lastMaintenanceDate?: Date;
  mileage: number;
  currentLocation?: Location;
  createdAt: Date;
  updatedAt: Date;
}
