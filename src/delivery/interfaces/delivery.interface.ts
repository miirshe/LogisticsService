import { Document } from 'mongoose';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Meta {
  key: string;
  value: any;
}

export interface DeliveryItem {
  name: string;
  quantity: number;
  weight: number;
  fragile: boolean;
}

export interface Delivery extends Document {
  deliveryType: 'PARCEL' | 'FOOD';
  deliveryStatus:
    | 'PENDING'
    | 'PICKED_UP'
    | 'IN_TRANSIT'
    | 'DELIVERED'
    | 'CANCELLED';
  origin: Location;
  destination: Location;
  waypoints?: Location[];
  scheduledPickupTime: Date;
  actualDeliveryTime?: Date;
  assignedFleet?: string;
  driver?: string;
  customer?: string;
  items: DeliveryItem[];
  meta?: Meta[];
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentAmount: number;
  trackingNumber?: string;
  deliveryAttempts?: number;
  lastAttemptTime?: Date;
  failureReason?: string;
  notes?: string;
  specialInstructions?: string;
  recipientName?: string;
  recipientContact?: string;
  recipientEmail?: string;
  insurance?: boolean;
  insuranceAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDeliveryRequest {
  delivery: Omit<Delivery, keyof Document>;
}

export interface UpdateDeliveryStatusRequest {
  deliveryId: string;
  status: Delivery['deliveryStatus'];
  notes?: string;
  updatedBy?: string;
  timestamp?: string;
}

export interface GetDeliveryRequest {
  id: string;
}

export interface ListDeliveriesRequest {
  page?: number;
  limit?: number;
  status?: Delivery['deliveryStatus'];
  startDate?: string;
  endDate?: string;
  customerId?: string;
  fleetId?: string;
  driverId?: string;
  deliveryType?: Delivery['deliveryType'];
}

export interface ListDeliveriesResponse {
  deliveries: Delivery[];
  total: number;
  page: number;
  limit: number;
}

export interface CancelDeliveryRequest {
  deliveryId: string;
  reason: string;
  canceledBy: string;
}

export interface AssignFleetRequest {
  deliveryId: string;
  fleetId: string;
  driverId: string;
  assignedBy: string;
}

export interface UpdateDeliveryRequest {
  deliveryId: string;
  updates: Partial<Omit<Delivery, keyof Document>>;
}

export interface TrackDeliveryRequest {
  trackingNumber: string;
}

export interface DeliveryStatusUpdate {
  status: Delivery['deliveryStatus'];
  timestamp: string;
  location?: Location;
  notes?: string;
  updatedBy?: string;
}

export interface DeliveryStatusHistory {
  deliveryId: string;
  updates: DeliveryStatusUpdate[];
}

export interface BatchCreateDeliveriesRequest {
  deliveries: Array<Omit<Delivery, keyof Document>>;
}

export interface BatchCreateDeliveriesResponse {
  successfulDeliveries: Delivery[];
  failedDeliveries: Array<{
    delivery: Omit<Delivery, keyof Document>;
    error: string;
  }>;
}

export interface EstimateDeliveryRequest {
  origin: Location;
  destination: Location;
  items: DeliveryItem[];
  deliveryType: Delivery['deliveryType'];
}

export interface EstimateDeliveryResponse {
  estimatedTime: string;
  estimatedCost: number;
  distance: number;
  suggestedFleet?: string;
}
