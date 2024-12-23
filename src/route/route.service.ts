/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AggregatePaginateModel, Model } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
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

@Injectable()
export class RouteService {
  constructor(
    @InjectModel('Route')
    private readonly routeModel: Model<Route> & AggregatePaginateModel<Route>,
  ) {}

  @GrpcMethod('RouteService')
  async createRoute(request: CreateRouteRequest): Promise<Route> {
    const route = new this.routeModel({
      ...request.route,
      status: request.route.status || 'PENDING',
      routeNumber: `RT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      lastUpdated: new Date().toISOString(),
    });

    // Calculate initial metrics
    route.metrics = {
      fuelConsumption: 0,
      co2Emission: 0,
      totalStops: route.deliveryStops?.length || 0,
      completedStops: 0,
      efficiency: 0,
      averageSpeed: 0,
    };

    return route.save();
  }

  @GrpcMethod('RouteService')
  async getRoute(request: GetRouteRequest): Promise<Route> {
    const route = await this.routeModel
      .findById(request.id)
      .populate('fleetId')
      .populate('driverId')
      .populate('deliveryIds');

    if (!route) {
      throw new Error('Route not found');
    }
    return route;
  }

  @GrpcMethod('RouteService')
  async updateRoute(request: UpdateRouteRequest): Promise<Route> {
    const route = await this.routeModel.findByIdAndUpdate(
      request.id,
      {
        $set: {
          ...request.route,
          lastUpdated: new Date().toISOString(),
        },
      },
      { new: true, runValidators: true },
    );

    if (!route) {
      throw new Error('Route not found');
    }
    return route;
  }

  @GrpcMethod('RouteService')
  async deleteRoute(request: DeleteRouteRequest): Promise<DeleteRouteResponse> {
    const route = await this.routeModel.findByIdAndDelete(request.id);

    if (!route) {
      return {
        success: false,
        message: 'Route not found',
      };
    }

    return {
      success: true,
      message: 'Route deleted successfully',
    };
  }

  @GrpcMethod('RouteService')
  async listRoutes(request: ListRoutesRequest): Promise<ListRoutesResponse> {
    const matchStage: any = {};

    if (request.status) {
      matchStage.status = request.status;
    }
    if (request.fleetId) {
      matchStage.fleetId = request.fleetId;
    }
    if (request.driverId) {
      matchStage.driverId = request.driverId;
    }
    if (request.startDate || request.endDate) {
      matchStage.startTime = {};
      if (request.startDate) {
        matchStage.startTime.$gte = request.startDate;
      }
      if (request.endDate) {
        matchStage.startTime.$lte = request.endDate;
      }
    }

    const aggregateQuery = this.routeModel.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: 'fleets',
          localField: 'fleetId',
          foreignField: '_id',
          as: 'fleet',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $lookup: {
          from: 'deliveries',
          localField: 'deliveryIds',
          foreignField: '_id',
          as: 'deliveries',
        },
      },
      {
        $unwind: {
          path: '$fleet',
          preserveNullAndEmptyArrays: true,
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

    const result = await this.routeModel.aggregatePaginate(
      aggregateQuery,
      options,
    );

    return {
      routes: result.docs,
      total: result.totalDocs,
      page: result.page,
      limit: result.limit,
    };
  }

  @GrpcMethod('RouteService')
  async optimizeRoute(request: OptimizeRouteRequest): Promise<Route> {
    const route = await this.routeModel.findById(request.routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    // Implement route optimization logic here
    // This is a placeholder for the actual optimization algorithm
    const optimizedWaypoints = this.optimizeWaypoints(
      request.waypoints,
      request.optimizationType,
    );

    route.waypoints = optimizedWaypoints;
    route.lastUpdated = new Date().toISOString();

    // Recalculate metrics
    route.totalDistance = this.calculateTotalDistance(optimizedWaypoints);
    route.estimatedDuration = this.estimateRouteDuration(optimizedWaypoints);

    return route.save();
  }

  @GrpcMethod('RouteService')
  async assignFleet(request: AssignFleetRequest): Promise<Route> {
    const route = await this.routeModel.findById(request.routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    route.fleetId = request.fleetId;
    route.driverId = request.driverId;
    route.status = 'ASSIGNED';
    route.lastUpdated = new Date().toISOString();

    return route.save();
  }

  @GrpcMethod('RouteService')
  async updateRouteStatus(request: UpdateRouteStatusRequest): Promise<Route> {
    const route = await this.routeModel.findById(request.routeId);
    if (!route) {
      throw new Error('Route not found');
    }

    route.status = request.status;
    if (request.notes) {
      route.meta = route.meta || {};
      route.meta.statusUpdateNotes = request.notes;
    }
    route.lastUpdated = new Date().toISOString();

    return route.save();
  }

  private optimizeWaypoints(waypoints: any[], type: string): any[] {
    // Implement actual optimization logic based on type
    // This is just a placeholder
    return waypoints.sort((a, b) => a.sequence - b.sequence);
  }

  private calculateTotalDistance(waypoints: any[]): number {
    let totalDistance = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += this.calculateDistance(waypoints[i], waypoints[i + 1]);
    }
    return totalDistance;
  }

  private calculateDistance(point1: any, point2: any): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude);
    const dLon = this.toRad(point2.longitude - point1.longitude);
    const lat1 = this.toRad(point1.latitude);
    const lat2 = this.toRad(point2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }

  private estimateRouteDuration(waypoints: any[]): number {
    const averageSpeed = 40; // km/h
    const totalDistance = this.calculateTotalDistance(waypoints);
    return totalDistance / averageSpeed; // hours
  }
}
