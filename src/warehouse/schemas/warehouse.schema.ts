import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Location } from '../../fleet/schemas/fleet.schema';

@Schema()
export class InventoryItem {
  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop()
  expiryDate: Date;
}

@Schema({ timestamps: true })
export class Warehouse extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Location, required: true })
  location: Location;

  @Prop({ required: true })
  contactPerson: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop({ required: true })
  capacity: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [InventoryItem] })
  inventory: InventoryItem[];
}

export const WarehouseSchema = SchemaFactory.createForClass(Warehouse);
