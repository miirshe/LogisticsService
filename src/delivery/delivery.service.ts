import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AggregatePaginateModel,
  AggregatePaginateResult,
  Model,
} from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
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

@Injectable()
export class DeliveryService {
  constructor(
    @InjectModel('Delivery')
    private readonly deliveryModel: Model<Delivery> &
      AggregatePaginateModel<Delivery>,
    @InjectModel('DeliveryStatusHistory')
    private readonly historyModel: Model<DeliveryStatusHistory>,
  ) {}

  @GrpcMethod('LogisticsService')
  async createDelivery(request: CreateDeliveryRequest): Promise<Delivery> {
    const delivery = new this.deliveryModel({
      ...request.delivery,
      deliveryStatus: 'PENDING',
      trackingNumber: `DEL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      deliveryAttempts: 0,
    });

    const savedDelivery = await delivery.save();

    // Create initial status history
    await this.historyModel.create({
      deliveryId: savedDelivery._id,
      updates: [
        {
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          notes: 'Delivery created',
        },
      ],
    });

    return savedDelivery;
  }

  @GrpcMethod('LogisticsService')
  async updateDeliveryStatus(
    request: UpdateDeliveryStatusRequest,
  ): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(request.deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.deliveryStatus = request.status;
    if (request.notes) delivery.notes = request.notes;

    // Update status history
    await this.historyModel.updateOne(
      { deliveryId: request.deliveryId },
      {
        $push: {
          updates: {
            status: request.status,
            timestamp: request.timestamp || new Date().toISOString(),
            notes: request.notes,
            updatedBy: request.updatedBy,
          },
        },
      },
      { upsert: true },
    );

    return delivery.save();
  }

  @GrpcMethod('LogisticsService')
  async getDelivery(request: GetDeliveryRequest): Promise<Delivery> {
    const delivery = await this.deliveryModel
      .findById(request.id)
      .populate('driver')
      .populate('customer')
      .populate('assignedFleet');

    if (!delivery) {
      throw new Error('Delivery not found');
    }
    return delivery;
  }

  @GrpcMethod('LogisticsService')
  async listDeliveries(
    request: ListDeliveriesRequest,
  ): Promise<AggregatePaginateResult<any>> {
    const matchStage: any = {};

    // Build match conditions
    if (request.status) {
      matchStage.deliveryStatus = request.status;
    }
    if (request.customerId) {
      matchStage.customer = request.customerId;
    }
    if (request.fleetId) {
      matchStage.assignedFleet = request.fleetId;
    }
    if (request.driverId) {
      matchStage.driver = request.driverId;
    }
    if (request.deliveryType) {
      matchStage.deliveryType = request.deliveryType;
    }
    if (request.startDate || request.endDate) {
      matchStage.scheduledPickupTime = {};
      if (request.startDate) {
        matchStage.scheduledPickupTime.$gte = new Date(request.startDate);
      }
      if (request.endDate) {
        matchStage.scheduledPickupTime.$lte = new Date(request.endDate);
      }
    }

    const aggregateQuery = this.deliveryModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'driver',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'fleets',
          localField: 'assignedFleet',
          foreignField: '_id',
          as: 'assignedFleet',
        },
      },
      {
        $unwind: {
          path: '$driver',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$assignedFleet',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const options = {
      page: request.page || 1,
      limit: request.limit || 10,
      sort: { createdAt: -1 },
    };

    return this.deliveryModel.aggregatePaginate(aggregateQuery, options);
  }

  @GrpcMethod('LogisticsService')
  async cancelDelivery(request: CancelDeliveryRequest): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(request.deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.deliveryStatus = 'CANCELLED';
    delivery.failureReason = request.reason;

    // Update status history
    await this.historyModel.updateOne(
      { deliveryId: request.deliveryId },
      {
        $push: {
          updates: {
            status: 'CANCELLED',
            timestamp: new Date().toISOString(),
            notes: request.reason,
            updatedBy: request.canceledBy,
          },
        },
      },
    );

    return delivery.save();
  }

  @GrpcMethod('LogisticsService')
  async assignFleet(request: AssignFleetRequest): Promise<Delivery> {
    const delivery = await this.deliveryModel.findById(request.deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    delivery.assignedFleet = request.fleetId;
    delivery.driver = request.driverId;

    // Update status history
    await this.historyModel.updateOne(
      { deliveryId: request.deliveryId },
      {
        $push: {
          updates: {
            status: delivery.deliveryStatus,
            timestamp: new Date().toISOString(),
            notes: `Fleet ${request.fleetId} and Driver ${request.driverId} assigned`,
            updatedBy: request.assignedBy,
          },
        },
      },
    );

    return delivery.save();
  }

  @GrpcMethod('LogisticsService')
  async updateDelivery(request: UpdateDeliveryRequest): Promise<Delivery> {
    const delivery = await this.deliveryModel.findByIdAndUpdate(
      request.deliveryId,
      { $set: request.updates },
      { new: true, runValidators: true },
    );

    if (!delivery) {
      throw new Error('Delivery not found');
    }

    return delivery;
  }

  @GrpcMethod('LogisticsService')
  async trackDelivery(request: TrackDeliveryRequest): Promise<Delivery> {
    const delivery = await this.deliveryModel
      .findOne({ trackingNumber: request.trackingNumber })
      .populate('driver')
      .populate('customer')
      .populate('assignedFleet');

    if (!delivery) {
      throw new Error('Delivery not found');
    }
    return delivery;
  }

  @GrpcMethod('LogisticsService')
  async getDeliveryStatusHistory(
    request: GetDeliveryRequest,
  ): Promise<DeliveryStatusHistory> {
    const history = await this.historyModel
      .findOne({ deliveryId: request.id })
      .sort({ 'updates.timestamp': -1 });

    if (!history) {
      throw new Error('Delivery history not found');
    }
    return history;
  }

  @GrpcMethod('LogisticsService')
  async batchCreateDeliveries(
    request: BatchCreateDeliveriesRequest,
  ): Promise<BatchCreateDeliveriesResponse> {
    const response: BatchCreateDeliveriesResponse = {
      successfulDeliveries: [],
      failedDeliveries: [],
    };

    for (const deliveryData of request.deliveries) {
      try {
        const delivery = new this.deliveryModel({
          ...deliveryData,
          deliveryStatus: 'PENDING',
          trackingNumber: `DEL-${Math.random()
            .toString(36)
            .substring(2, 9)
            .toUpperCase()}`,
          deliveryAttempts: 0,
        });

        const savedDelivery = await delivery.save();

        // Create initial status history
        await this.historyModel.create({
          deliveryId: savedDelivery._id,
          updates: [
            {
              status: 'PENDING',
              timestamp: new Date().toISOString(),
              notes: 'Delivery created',
            },
          ],
        });

        response.successfulDeliveries.push(savedDelivery);
      } catch (error) {
        response.failedDeliveries.push({
          delivery: deliveryData,
          error: error.message,
        });
      }
    }

    return response;
  }

  @GrpcMethod('LogisticsService')
  async estimateDelivery(
    request: EstimateDeliveryRequest,
  ): Promise<EstimateDeliveryResponse> {
    const distance = this.calculateDistance(
      request.origin,
      request.destination,
    );
    const totalWeight = request.items.reduce(
      (sum, item) => sum + item.weight,
      0,
    );

    const estimatedTimeInMinutes = distance * 2;
    const baseCost = distance * 2;
    const weightCost = totalWeight * 0.5;

    return {
      estimatedTime: `${Math.ceil(estimatedTimeInMinutes)} minutes`,
      estimatedCost: baseCost + weightCost,
      distance: distance,
      suggestedFleet: this.suggestFleet(totalWeight, request.deliveryType),
    };
  }

  private calculateDistance(origin: any, destination: any): number {
    const R = 6371;
    const dLat = this.toRad(destination.latitude - origin.latitude);
    const dLon = this.toRad(destination.longitude - origin.longitude);
    const lat1 = this.toRad(origin.latitude);
    const lat2 = this.toRad(destination.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private suggestFleet(totalWeight: number, deliveryType: string): string {
    if (totalWeight > 1000) return 'TRUCK';
    if (totalWeight > 500) return 'VAN';
    if (deliveryType === 'EXPRESS') return 'MOTORCYCLE';
    return 'STANDARD';
  }
}
