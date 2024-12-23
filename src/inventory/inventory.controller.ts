import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InventoryService } from './inventory.service';
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

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @GrpcMethod('InventoryService', 'AddInventoryItem')
  async addInventoryItem(
    request: AddInventoryItemRequest,
  ): Promise<InventoryItem> {
    return this.inventoryService.addInventoryItem(request);
  }

  @GrpcMethod('InventoryService', 'UpdateInventoryItem')
  async updateInventoryItem(
    request: UpdateInventoryItemRequest,
  ): Promise<InventoryItem> {
    return this.inventoryService.updateInventoryItem(request);
  }

  @GrpcMethod('InventoryService', 'GetInventoryItem')
  async getInventoryItem(
    request: GetInventoryItemRequest,
  ): Promise<InventoryItem> {
    return this.inventoryService.getInventoryItem(request);
  }

  @GrpcMethod('InventoryService', 'ListInventoryItems')
  async listInventoryItems(
    request: ListInventoryItemsRequest,
  ): Promise<ListInventoryItemsResponse> {
    return this.inventoryService.listInventoryItems(request);
  }

  @GrpcMethod('InventoryService', 'DeleteInventoryItem')
  async deleteInventoryItem(
    request: DeleteInventoryItemRequest,
  ): Promise<DeleteInventoryItemResponse> {
    return this.inventoryService.deleteInventoryItem(request);
  }

  @GrpcMethod('InventoryService', 'AdjustInventoryQuantity')
  async adjustInventoryQuantity(
    request: AdjustInventoryQuantityRequest,
  ): Promise<InventoryItem> {
    return this.inventoryService.adjustInventoryQuantity(request);
  }

  @GrpcMethod('InventoryService', 'LogInventoryChange')
  async logInventoryChange(
    request: LogInventoryChangeRequest,
  ): Promise<InventoryLog> {
    return this.inventoryService.logInventoryChange(request);
  }

  @GrpcMethod('InventoryService', 'GetInventoryLogs')
  async getInventoryLogs(
    request: GetInventoryLogsRequest,
  ): Promise<GetInventoryLogsResponse> {
    return this.inventoryService.getInventoryLogs(request);
  }
}
