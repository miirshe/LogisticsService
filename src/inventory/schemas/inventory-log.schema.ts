import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryLog extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Warehouse',
    required: true,
  })
  warehouseId: string;

  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  quantityChange: number;

  @Prop({ required: true })
  remainingStock: number;

  @Prop({ required: true, enum: ['ADDED', 'REMOVED', 'UPDATED'] })
  action: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog);
