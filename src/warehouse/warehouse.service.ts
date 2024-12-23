/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, Model } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
import {
  Warehouse,
  CreateWarehouseRequest,
  GetWarehouseRequest,
  UpdateWarehouseRequest,
  DeleteWarehouseRequest,
  DeleteWarehouseResponse,
  ListWarehousesRequest,
  ListWarehousesResponse,
} from './interfaces/warehouse.interface';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectModel('Warehouse')
    private readonly warehouseModel: Model<Warehouse> &
      AggregatePaginateModel<Warehouse>,
  ) {}

  @GrpcMethod('WarehouseService')
  async createWarehouse(request: CreateWarehouseRequest): Promise<Warehouse> {
    const warehouse = new this.warehouseModel({
      ...request.warehouse,
      status: request.warehouse.status || 'ACTIVE',
      lastUpdated: new Date().toISOString(),
    });

    return warehouse.save();
  }

  @GrpcMethod('WarehouseService')
  async getWarehouse(request: GetWarehouseRequest): Promise<Warehouse> {
    const warehouse = await this.warehouseModel.findById(request.id);
    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return warehouse;
  }

  @GrpcMethod('WarehouseService')
  async updateWarehouse(request: UpdateWarehouseRequest): Promise<Warehouse> {
    const warehouse = await this.warehouseModel.findByIdAndUpdate(
      request.id,
      {
        $set: {
          ...request.warehouse,
          lastUpdated: new Date().toISOString(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!warehouse) {
      throw new Error('Warehouse not found');
    }
    return warehouse;
  }

  @GrpcMethod('WarehouseService')
  async deleteWarehouse(
    request: DeleteWarehouseRequest,
  ): Promise<DeleteWarehouseResponse> {
    const warehouse = await this.warehouseModel.findByIdAndDelete(request.id);

    if (!warehouse) {
      return {
        success: false,
        message: 'Warehouse not found',
      };
    }

    return {
      success: true,
      message: 'Warehouse deleted successfully',
    };
  }

  @GrpcMethod('WarehouseService')
  async listWarehouses(
    request: ListWarehousesRequest,
  ): Promise<ListWarehousesResponse> {
    const matchStage: any = {};

    if (request.type) {
      matchStage.type = request.type;
    }
    if (request.status) {
      matchStage.status = request.status;
    }
    if (request.city) {
      matchStage['location.city'] = request.city;
    }
    if (request.country) {
      matchStage['location.country'] = request.country;
    }

    const aggregateQuery = this.warehouseModel.aggregate([
      { $match: matchStage },
    ]);

    const options = {
      page: request.page || 1,
      limit: request.limit || 10,
      sort: { lastUpdated: -1 },
    };

    const result = await this.warehouseModel.aggregatePaginate(
      aggregateQuery,
      options,
    );

    return {
      warehouses: result.docs,
      total: result.totalDocs,
      page: result.page,
      limit: result.limit,
    };
  }
}
