import { Document } from 'mongoose';
import { Location } from '../../fleet/interfaces/fleet.interface';

export interface Route extends Document {
  deliveryId: string;
  waypoints: Location[];
  optimizedRoute: Location[];
  distance: number;
  estimatedTime: number;
  trafficConditions: string;
  createdAt: Date;
  updatedAt: Date;
}
