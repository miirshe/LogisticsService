export interface InventoryItem {
  id?: string;
  warehouseId: string;
  name: string;
  description?: string;
  category: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  unit: string;
  status?: string;
  lastUpdated?: string;
  meta?: { [key: string]: string };
}

export interface InventoryLog {
  id?: string;
  warehouseId: string;
  itemId: string;
  changeType: string;
  quantityBefore: number;
  quantityAfter: number;
  quantityChanged: number;
  reason: string;
  reference?: string;
  userId: string;
  timestamp: string;
}

export interface AddInventoryItemRequest {
  warehouseId: string;
  item: InventoryItem;
}

export interface UpdateInventoryItemRequest {
  warehouseId: string;
  itemId: string;
  item: Partial<InventoryItem>;
}

export interface GetInventoryItemRequest {
  warehouseId: string;
  itemId: string;
}

export interface ListInventoryItemsRequest {
  warehouseId: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ListInventoryItemsResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface DeleteInventoryItemRequest {
  warehouseId: string;
  itemId: string;
}

export interface DeleteInventoryItemResponse {
  success: boolean;
  message: string;
}

export interface AdjustInventoryQuantityRequest {
  warehouseId: string;
  itemId: string;
  adjustment: number;
  reason: string;
  reference?: string;
  userId: string;
}

export interface LogInventoryChangeRequest {
  log: InventoryLog;
}

export interface GetInventoryLogsRequest {
  warehouseId: string;
  itemId?: string;
  startDate?: string;
  endDate?: string;
  changeType?: string;
  page?: number;
  limit?: number;
}

export interface GetInventoryLogsResponse {
  logs: InventoryLog[];
  total: number;
  page: number;
  limit: number;
}
