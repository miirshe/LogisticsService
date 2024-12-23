export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode?: string;
}

export interface Warehouse {
  id?: string;
  name: string;
  code: string;
  type: string;
  capacity: number;
  location: Location;
  status?: string;
  managers: string[];
  lastUpdated?: string;
  meta?: { [key: string]: string };
}

export interface CreateWarehouseRequest {
  warehouse: Warehouse;
}

export interface GetWarehouseRequest {
  id: string;
}

export interface UpdateWarehouseRequest {
  id: string;
  warehouse: Partial<Warehouse>;
}

export interface DeleteWarehouseRequest {
  id: string;
}

export interface DeleteWarehouseResponse {
  success: boolean;
  message: string;
}

export interface ListWarehousesRequest {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  city?: string;
  country?: string;
}

export interface ListWarehousesResponse {
  warehouses: Warehouse[];
  total: number;
  page: number;
  limit: number;
}
