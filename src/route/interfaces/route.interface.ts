export interface Waypoint {
  latitude: number;
  longitude: number;
  address?: string;
  type: string;
  sequence: number;
  estimatedArrival?: string;
  actualArrival?: string;
}

export interface DeliveryStop {
  deliveryId: string;
  status: string;
  scheduledTime?: string;
  actualTime?: string;
  location: Waypoint;
  notes?: string;
}

export interface RouteMetrics {
  fuelConsumption: number;
  co2Emission: number;
  totalStops: number;
  completedStops: number;
  efficiency: number;
  averageSpeed: number;
}

export interface Route {
  id?: string;
  routeNumber: string;
  fleetId?: string;
  driverId?: string;
  waypoints: Waypoint[];
  status?: string;
  startTime?: string;
  endTime?: string;
  totalDistance: number;
  estimatedDuration: number;
  actualDuration: number;
  deliveryStops: DeliveryStop[];
  deliveryIds: string[];
  metrics: RouteMetrics;
  meta?: { [key: string]: string };
  lastUpdated?: string;
  createdAt?: string;
}

export interface CreateRouteRequest {
  route: Route;
}

export interface GetRouteRequest {
  id: string;
}

export interface UpdateRouteRequest {
  id: string;
  route: Partial<Route>;
}

export interface DeleteRouteRequest {
  id: string;
}

export interface DeleteRouteResponse {
  success: boolean;
  message: string;
}

export interface ListRoutesRequest {
  page?: number;
  limit?: number;
  status?: string;
  fleetId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ListRoutesResponse {
  routes: Route[];
  total: number;
  page: number;
  limit: number;
}

export interface OptimizeRouteRequest {
  routeId: string;
  waypoints: Waypoint[];
  optimizationType: string;
}

export interface AssignFleetRequest {
  routeId: string;
  fleetId: string;
  driverId: string;
}

export interface UpdateRouteStatusRequest {
  routeId: string;
  status: string;
  notes?: string;
}
