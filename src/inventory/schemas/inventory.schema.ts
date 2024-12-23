/* eslint-disable @typescript-eslint/no-require-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryItem extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Warehouse' })
  warehouseId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ default: 'AVAILABLE' })
  status: string;

  @Prop()
  lastUpdated?: string;

  @Prop({ type: Object, default: {} })
  meta: { [key: string]: string };
}

export const InventoryItemSchema = SchemaFactory.createForClass(
  InventoryItem,
).plugin(require('mongoose-aggregate-paginate-v2'));
