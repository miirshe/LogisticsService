export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp?: string;
}

export interface MaintenanceRecord {
  type: string;
  description: string;
  date: string;
  status: string;
  cost: number;
  technician: string;
  notes: string;
}

export interface Fleet {
  id?: string;
  // Vehicle Type Info
  vehicleType: string;
  fleetType: string;
  licensePlate: string;
  registrationNumber: string;

  // Vehicle Details
  make: string;
  manufacturer: string;
  modelName: string;
  year: number;
  capacity: number;

  // Fuel Information
  fuelType: string;
  fuelLevel: number;

  // Driver Information
  driverId?: string;
  driverName?: string;
  driverContact?: string;
  driverLicenseNumber?: string;

  // Status and Tracking
  status?: string;
  lastMaintenanceDate?: string;
  mileage?: number;
  currentLocation?: Location;

  // Maintenance Records
  maintenanceRecords?: MaintenanceRecord[];
  lastUpdated?: string;
  meta?: { [key: string]: string };
}

export interface CreateFleetRequest {
  fleet: Fleet;
}

export interface GetFleetRequest {
  id: string;
}

export interface UpdateFleetRequest {
  id: string;
  fleet: Partial<Fleet>;
}

export interface DeleteFleetRequest {
  id: string;
}

export interface DeleteFleetResponse {
  success: boolean;
  message: string;
}

export interface ListFleetsRequest {
  page?: number;
  limit?: number;
  status?: string;
  vehicleType?: string;
  driverId?: string;
  fleetType?: string;
}

export interface ListFleetsResponse {
  fleets: Fleet[];
  total: number;
  page: number;
  limit: number;
}

export interface AssignDriverRequest {
  fleetId: string;
  driverId: string;
  driverName: string;
  driverContact: string;
  driverLicenseNumber: string;
}

export interface TrackFleetRequest {
  fleetId: string;
}
