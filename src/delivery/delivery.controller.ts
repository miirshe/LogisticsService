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

  @GrpcMethod('DeliveryService', 'CreateDelivery')
  createDelivery(data: CreateDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.createDelivery(data);
  }

  @GrpcMethod('DeliveryService', 'UpdateDeliveryStatus')
  updateDeliveryStatus(data: UpdateDeliveryStatusRequest): Promise<Delivery> {
    return this.deliveryService.updateDeliveryStatus(data);
  }

  @GrpcMethod('DeliveryService', 'GetDelivery')
  getDelivery(data: GetDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.getDelivery(data);
  }

  @GrpcMethod('DeliveryService', 'ListDeliveries')
  listDeliveries(data: ListDeliveriesRequest): Promise<any> {
    return this.deliveryService.listDeliveries(data);
  }

  @GrpcMethod('DeliveryService', 'CancelDelivery')
  cancelDelivery(data: CancelDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.cancelDelivery(data);
  }

  @GrpcMethod('DeliveryService', 'AssignFleet')
  assignFleet(data: AssignFleetRequest): Promise<Delivery> {
    return this.deliveryService.assignFleet(data);
  }

  @GrpcMethod('DeliveryService', 'UpdateDelivery')
  updateDelivery(data: UpdateDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.updateDelivery(data);
  }

  @GrpcMethod('DeliveryService', 'TrackDelivery')
  trackDelivery(data: TrackDeliveryRequest): Promise<Delivery> {
    return this.deliveryService.trackDelivery(data);
  }

  @GrpcMethod('DeliveryService', 'GetDeliveryStatusHistory')
  getDeliveryStatusHistory(
    data: GetDeliveryRequest,
  ): Promise<DeliveryStatusHistory> {
    return this.deliveryService.getDeliveryStatusHistory(data);
  }

  @GrpcMethod('DeliveryService', 'BatchCreateDeliveries')
  batchCreateDeliveries(
    data: BatchCreateDeliveriesRequest,
  ): Promise<BatchCreateDeliveriesResponse> {
    return this.deliveryService.batchCreateDeliveries(data);
  }

  @GrpcMethod('DeliveryService', 'EstimateDelivery')
  estimateDelivery(
    data: EstimateDeliveryRequest,
  ): Promise<EstimateDeliveryResponse> {
    return this.deliveryService.estimateDelivery(data);
  }
}
