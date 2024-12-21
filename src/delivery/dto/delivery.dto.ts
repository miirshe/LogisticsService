import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../fleet/dto/fleet.dto';

export enum DeliveryType {
  PARCEL = 'PARCEL',
  FOOD = 'FOOD',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export class DeliveryItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @IsBoolean()
  @IsOptional()
  fragile?: boolean;
}

export class CreateDeliveryDto {
  @IsEnum(DeliveryType)
  @IsNotEmpty()
  deliveryType: DeliveryType;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  origin: LocationDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  destination: LocationDto;

  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  @IsArray()
  @IsOptional()
  waypoints?: LocationDto[];

  @IsString()
  @IsNotEmpty()
  scheduledPickupTime: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryItemDto)
  @IsNotEmpty()
  items: DeliveryItemDto[];

  @IsNumber()
  @IsNotEmpty()
  paymentAmount: number;
}

export class UpdateDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status: DeliveryStatus;
}
