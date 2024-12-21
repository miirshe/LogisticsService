import {
  IsString,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from 'src/fleet/dto/fleet.dto';

export class OptimizeRouteDto {
  @IsString()
  @IsNotEmpty()
  deliveryId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  @IsNotEmpty()
  waypoints: LocationDto[];
}

export class UpdateRouteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LocationDto)
  @IsNotEmpty()
  optimizedRoute: LocationDto[];

  @IsNumber()
  @IsNotEmpty()
  distance: number;

  @IsNumber()
  @IsNotEmpty()
  estimatedTime: number;

  @IsString()
  @IsNotEmpty()
  trafficConditions: string;
}
