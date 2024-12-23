/* eslint-disable @typescript-eslint/no-require-imports */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class InventoryLog extends Document {
  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Warehouse',
  })
  warehouseId: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: 'InventoryItem',
  })
  itemId: string;

  @Prop({ required: true })
  changeType: string;

  @Prop({ required: true })
  quantityBefore: number;

  @Prop({ required: true })
  quantityAfter: number;

  @Prop({ required: true })
  quantityChanged: number;

  @Prop({ required: true })
  reason: string;

  @Prop()
  reference?: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  timestamp: string;
}

export const InventoryLogSchema = SchemaFactory.createForClass(
  InventoryLog,
).plugin(require('mongoose-aggregate-paginate-v2'));
