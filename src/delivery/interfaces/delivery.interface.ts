import { Document } from 'mongoose';
import { Location } from 'src/fleet/interfaces/fleet.interface';

export interface DeliveryItem {
  name: string;
  quantity: number;
  weight: number;
  fragile: boolean;
}

export interface Delivery extends Document {
  deliveryType: string;
  deliveryStatus: string;
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  scheduledPickupTime: Date;
  actualDeliveryTime?: Date;
  assignedFleet?: string;
  items: DeliveryItem[];
  paymentStatus: string;
  paymentAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
