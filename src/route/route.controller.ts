import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RouteService } from './route.service';
import {
  Route,
  CreateRouteRequest,
  GetRouteRequest,
  UpdateRouteRequest,
  DeleteRouteRequest,
  DeleteRouteResponse,
  ListRoutesRequest,
  ListRoutesResponse,
  OptimizeRouteRequest,
  AssignFleetRequest,
  UpdateRouteStatusRequest,
} from './interfaces/route.interface';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @GrpcMethod('RouteService', 'CreateRoute')
  async createRoute(request: CreateRouteRequest): Promise<Route> {
    return this.routeService.createRoute(request);
  }

  @GrpcMethod('RouteService', 'GetRoute')
  async getRoute(request: GetRouteRequest): Promise<Route> {
    return this.routeService.getRoute(request);
  }

  @GrpcMethod('RouteService', 'UpdateRoute')
  async updateRoute(request: UpdateRouteRequest): Promise<Route> {
    return this.routeService.updateRoute(request);
  }

  @GrpcMethod('RouteService', 'DeleteRoute')
  async deleteRoute(request: DeleteRouteRequest): Promise<DeleteRouteResponse> {
    return this.routeService.deleteRoute(request);
  }

  @GrpcMethod('RouteService', 'ListRoutes')
  async listRoutes(request: ListRoutesRequest): Promise<ListRoutesResponse> {
    return this.routeService.listRoutes(request);
  }

  @GrpcMethod('RouteService', 'OptimizeRoute')
  async optimizeRoute(request: OptimizeRouteRequest): Promise<Route> {
    return this.routeService.optimizeRoute(request);
  }

  @GrpcMethod('RouteService', 'AssignFleet')
  async assignFleet(request: AssignFleetRequest): Promise<Route> {
    return this.routeService.assignFleet(request);
  }

  @GrpcMethod('RouteService', 'UpdateRouteStatus')
  async updateRouteStatus(request: UpdateRouteStatusRequest): Promise<Route> {
    return this.routeService.updateRouteStatus(request);
  }
}
