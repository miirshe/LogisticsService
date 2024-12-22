import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DeliveryService } from './delivery.service';
import {
  Delivery,
  CreateDeliveryRequest,
  UpdateDeliveryStatusRequest,
  GetDeliveryRequest,
  ListDeliveriesRequest,
  CancelDeliveryRequest,
  AssignFleetRequest,
  UpdateDeliveryRequest,
  TrackDeliveryRequest,
  DeliveryStatusHistory,
  BatchCreateDeliveriesRequest,
  BatchCreateDeliveriesResponse,
  EstimateDeliveryRequest,
  EstimateDeliveryResponse,
} from './interfaces/delivery.interface';

@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @GrpcMethod('LogisticsService', 'CreateDelivery')
  createDelivery(data: CreateDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.createDelivery(data);
  }

  @GrpcMethod('LogisticsService', 'UpdateDeliveryStatus')
  updateDeliveryStatus(data: UpdateDeliveryStatusRequest): Promise<Delivery> {
    return this.deliveryService.updateDeliveryStatus(data);
  }

  @GrpcMethod('LogisticsService', 'GetDelivery')
  getDelivery(data: GetDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.getDelivery(data);
  }

  @GrpcMethod('LogisticsService', 'ListDeliveries')
  listDeliveries(data: ListDeliveriesRequest): Promise<any> {
    return this.deliveryService.listDeliveries(data);
  }

  @GrpcMethod('LogisticsService', 'CancelDelivery')
  cancelDelivery(data: CancelDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.cancelDelivery(data);
  }

  @GrpcMethod('LogisticsService', 'AssignFleet')
  assignFleet(data: AssignFleetRequest): Promise<Delivery> {
    return this.deliveryService.assignFleet(data);
  }

  @GrpcMethod('LogisticsService', 'UpdateDelivery')
  updateDelivery(data: UpdateDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.updateDelivery(data);
  }

  @GrpcMethod('LogisticsService', 'TrackDelivery')
  trackDelivery(data: TrackDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.trackDelivery(data);
  }

  @GrpcMethod('LogisticsService', 'GetDeliveryStatusHistory')
  getDeliveryStatusHistory(
    data: GetDeliveryRequest,
  ): Promise<DeliveryStatusHistory> {
    return this.deliveryService.getDeliveryStatusHistory(data);
  }

  @GrpcMethod('LogisticsService', 'BatchCreateDeliveries')
  batchCreateDeliveries(
    data: BatchCreateDeliveriesRequest,
  ): Promise<BatchCreateDeliveriesResponse> {
    return this.deliveryService.batchCreateDeliveries(data);
  }

  @GrpcMethod('LogisticsService', 'EstimateDelivery')
  estimateDelivery(
    data: EstimateDeliveryRequest,
  ): Promise<EstimateDeliveryResponse> {
    return this.deliveryService.estimateDelivery(data);
  }
}
