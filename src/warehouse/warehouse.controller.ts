import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { WarehouseService } from './warehouse.service';
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

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @GrpcMethod('WarehouseService', 'CreateWarehouse')
  async createWarehouse(request: CreateWarehouseRequest): Promise<Warehouse> {
    return this.warehouseService.createWarehouse(request);
  }

  @GrpcMethod('WarehouseService', 'GetWarehouse')
  async getWarehouse(request: GetWarehouseRequest): Promise<Warehouse> {
    return this.warehouseService.getWarehouse(request);
  }

  @GrpcMethod('WarehouseService', 'UpdateWarehouse')
  async updateWarehouse(request: UpdateWarehouseRequest): Promise<Warehouse> {
    return this.warehouseService.updateWarehouse(request);
  }

  @GrpcMethod('WarehouseService', 'DeleteWarehouse')
  async deleteWarehouse(
    request: DeleteWarehouseRequest,
  ): Promise<DeleteWarehouseResponse> {
    return this.warehouseService.deleteWarehouse(request);
  }

  @GrpcMethod('WarehouseService', 'ListWarehouses')
  async listWarehouses(
    request: ListWarehousesRequest,
  ): Promise<ListWarehousesResponse> {
    return this.warehouseService.listWarehouses(request);
  }
}
