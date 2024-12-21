import { Document } from 'mongoose';

export interface InventoryLog extends Document {
  warehouseId: string;
  itemName: string;
  sku: string;
  quantityChange: number;
  remainingStock: number;
  action: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}
