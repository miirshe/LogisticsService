import { Document } from 'mongoose';
import { Location } from '../../fleet/interfaces/fleet.interface';

export interface InventoryItem {
  itemName: string;
  sku: string;
  quantity: number;
  expiryDate?: Date;
}

export interface Warehouse extends Document {
  name: string;
  location: Location;
  contactPerson: string;
  contactNumber: string;
  capacity: number;
  isActive: boolean;
  inventory: InventoryItem[];
  createdAt: Date;
  updatedAt: Date;
}
