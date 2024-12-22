import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, AggregatePaginateResult } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
import {
  Fleet,
  CreateFleetRequest,
  GetFleetRequest,
  UpdateFleetRequest,
  DeleteFleetRequest,
  DeleteFleetResponse,
  ListFleetsRequest,
  AssignDriverRequest,
  TrackFleetRequest,
} from './interfaces/fleet.interface';

@Injectable()
export class FleetService {
  constructor(
    @InjectModel('Fleet')
    private readonly fleetModel: AggregatePaginateModel<Fleet>,
  ) {}

  @GrpcMethod('FleetService')
  async createFleet(request: CreateFleetRequest): Promise<Fleet> {
    const fleet = new this.fleetModel({
      ...request.fleet,
      status: request.fleet.status || 'AVAILABLE',
      mileage: request.fleet.mileage || 0,
      lastUpdated: new Date().toISOString(),
    });

    return fleet.save();
  }

  @GrpcMethod('FleetService')
  async getFleet(request: GetFleetRequest): Promise<Fleet> {
    const fleet = await this.fleetModel
      .findById(request.id)
      .populate('driverId');

    if (!fleet) {
      throw new Error('Fleet not found');
    }
    return fleet;
  }

  @GrpcMethod('FleetService')
  async updateFleet(request: UpdateFleetRequest): Promise<Fleet> {
    const fleet = await this.fleetModel.findByIdAndUpdate(
      request.id,
      {
        $set: {
          ...request.fleet,
          lastUpdated: new Date().toISOString(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!fleet) {
      throw new Error('Fleet not found');
    }
    return fleet;
  }

  @GrpcMethod('FleetService')
  async deleteFleet(request: DeleteFleetRequest): Promise<DeleteFleetResponse> {
    const fleet = await this.fleetModel.findByIdAndDelete(request.id);

    if (!fleet) {
      return {
        success: false,
        message: 'Fleet not found',
      };
    }

    return {
      success: true,
      message: 'Fleet deleted successfully',
    };
  }

  @GrpcMethod('FleetService')
  async listFleets(
    request: ListFleetsRequest,
  ): Promise<AggregatePaginateResult<any>> {
    const matchStage: any = {};

    if (request.status) {
      matchStage.status = request.status;
    }
    if (request.vehicleType) {
      matchStage.vehicleType = request.vehicleType;
    }
    if (request.driverId) {
      matchStage.driverId = request.driverId;
    }
    if (request.fleetType) {
      matchStage.fleetType = request.fleetType;
    }

    const aggregateQuery = this.fleetModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'users',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $unwind: {
          path: '$driver',
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    const options = {
      page: request.page || 1,
      limit: request.limit || 10,
      sort: { lastUpdated: -1 },
    };

    const result = await this.fleetModel.aggregatePaginate(
      aggregateQuery,
      options,
    );

    return result as AggregatePaginateResult<any>;
  }

  @GrpcMethod('FleetService')
  async assignDriver(request: AssignDriverRequest): Promise<Fleet> {
    const fleet = await this.fleetModel.findById(request.fleetId);
    if (!fleet) {
      throw new Error('Fleet not found');
    }

    fleet.driverId = request.driverId;
    fleet.driverName = request.driverName;
    fleet.driverContact = request.driverContact;
    fleet.driverLicenseNumber = request.driverLicenseNumber;
    fleet.status = 'ASSIGNED';
    fleet.lastUpdated = new Date().toISOString();

    return fleet.save();
  }

  @GrpcMethod('FleetService')
  async trackFleet(request: TrackFleetRequest): Promise<Fleet> {
    const fleet = await this.fleetModel
      .findById(request.fleetId)
      .populate('driverId');

    if (!fleet) {
      throw new Error('Fleet not found');
    }

    return fleet;
  }
}
