/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, Model } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
import {
  InventoryItem,
  InventoryLog,
  AddInventoryItemRequest,
  UpdateInventoryItemRequest,
  GetInventoryItemRequest,
  ListInventoryItemsRequest,
  ListInventoryItemsResponse,
  DeleteInventoryItemRequest,
  DeleteInventoryItemResponse,
  AdjustInventoryQuantityRequest,
  LogInventoryChangeRequest,
  GetInventoryLogsRequest,
  GetInventoryLogsResponse,
} from './interfaces/inventory.interface';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel('InventoryItem')
    private readonly inventoryItemModel: Model<InventoryItem> &
      AggregatePaginateModel<InventoryItem>,
    @InjectModel('InventoryLog')
    private readonly inventoryLogModel: Model<InventoryLog> &
      AggregatePaginateModel<InventoryLog>,
  ) {}

  @GrpcMethod('InventoryService')
  async addInventoryItem(
    request: AddInventoryItemRequest,
  ): Promise<InventoryItem> {
    const item = new this.inventoryItemModel({
      ...request.item,
      warehouseId: request.warehouseId,
      status: request.item.status || 'AVAILABLE',
      lastUpdated: new Date().toISOString(),
    });

    return item.save();
  }

  @GrpcMethod('InventoryService')
  async updateInventoryItem(
    request: UpdateInventoryItemRequest,
  ): Promise<InventoryItem> {
    const item = await this.inventoryItemModel.findOneAndUpdate(
      {
        _id: request.itemId,
        warehouseId: request.warehouseId,
      },
      {
        $set: {
          ...request.item,
          lastUpdated: new Date().toISOString(),
        },
      },
      { new: true },
    );

    if (!item) {
      throw new Error('Inventory item not found');
    }

    return item;
  }

  @GrpcMethod('InventoryService')
  async getInventoryItem(
    request: GetInventoryItemRequest,
  ): Promise<InventoryItem> {
    const item = await this.inventoryItemModel.findOne({
      _id: request.itemId,
      warehouseId: request.warehouseId,
    });

    if (!item) {
      throw new Error('Inventory item not found');
    }

    return item;
  }

  @GrpcMethod('InventoryService')
  async listInventoryItems(
    request: ListInventoryItemsRequest,
  ): Promise<ListInventoryItemsResponse> {
    const matchStage: any = {
      warehouseId: request.warehouseId,
    };

    if (request.category) {
      matchStage.category = request.category;
    }
    if (request.status) {
      matchStage.status = request.status;
    }

    const aggregateQuery = this.inventoryItemModel.aggregate([
      { $match: matchStage },
    ]);

    const options = {
      page: request.page || 1,
      limit: request.limit || 10,
      sort: { lastUpdated: -1 },
    };

    const result = await this.inventoryItemModel.aggregatePaginate(
      aggregateQuery,
      options,
    );

    return {
      items: result.docs,
      total: result.totalDocs,
      page: result.page,
      limit: result.limit,
    };
  }

  @GrpcMethod('InventoryService')
  async deleteInventoryItem(
    request: DeleteInventoryItemRequest,
  ): Promise<DeleteInventoryItemResponse> {
    const item = await this.inventoryItemModel.findOneAndDelete({
      _id: request.itemId,
      warehouseId: request.warehouseId,
    });

    if (!item) {
      return {
        success: false,
        message: 'Inventory item not found',
      };
    }

    return {
      success: true,
      message: 'Inventory item deleted successfully',
    };
  }

  @GrpcMethod('InventoryService')
  async adjustInventoryQuantity(
    request: AdjustInventoryQuantityRequest,
  ): Promise<InventoryItem> {
    const item = await this.inventoryItemModel.findOne({
      _id: request.itemId,
      warehouseId: request.warehouseId,
    });

    if (!item) {
      throw new Error('Inventory item not found');
    }

    const quantityBefore = item.quantity;
    const quantityAfter = quantityBefore + request.adjustment;

    if (quantityAfter < 0) {
      throw new Error('Insufficient inventory quantity');
    }

    item.quantity = quantityAfter;
    item.lastUpdated = new Date().toISOString();

    // Log the change
    await this.logInventoryChange({
      log: {
        warehouseId: request.warehouseId,
        itemId: request.itemId,
        changeType: request.adjustment > 0 ? 'INCREASE' : 'DECREASE',
        quantityBefore,
        quantityAfter,
        quantityChanged: request.adjustment,
        reason: request.reason,
        reference: request.reference,
        userId: request.userId,
        timestamp: new Date().toISOString(),
      },
    });

    return item.save();
  }

  @GrpcMethod('InventoryService')
  async logInventoryChange(
    request: LogInventoryChangeRequest,
  ): Promise<InventoryLog> {
    const log = new this.inventoryLogModel(request.log);
    return log.save();
  }

  @GrpcMethod('InventoryService')
  async getInventoryLogs(
    request: GetInventoryLogsRequest,
  ): Promise<GetInventoryLogsResponse> {
    const matchStage: any = {
      warehouseId: request.warehouseId,
    };

    if (request.itemId) {
      matchStage.itemId = request.itemId;
    }
    if (request.changeType) {
      matchStage.changeType = request.changeType;
    }
    if (request.startDate || request.endDate) {
      matchStage.timestamp = {};
      if (request.startDate) {
        matchStage.timestamp.$gte = request.startDate;
      }
      if (request.endDate) {
        matchStage.timestamp.$lte = request.endDate;
      }
    }

    const aggregateQuery = this.inventoryLogModel.aggregate([
      { $match: matchStage },
      { $sort: { timestamp: -1 } },
    ]);

    const options = {
      page: request.page || 1,
      limit: request.limit || 10,
    };

    const result = await this.inventoryLogModel.aggregatePaginate(
      aggregateQuery,
      options,
    );

    return {
      logs: result.docs,
      total: result.totalDocs,
      page: result.page,
      limit: result.limit,
    };
  }
}
