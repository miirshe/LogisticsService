import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FleetService } from './fleet.service';
import {
  Fleet,
  CreateFleetRequest,
  GetFleetRequest,
  UpdateFleetRequest,
  DeleteFleetRequest,
  DeleteFleetResponse,
  ListFleetsRequest,
  AssignDriverRequest,
  TrackFleetRequest,
} from './interfaces/fleet.interface';

@Controller('fleet')
export class FleetController {
  constructor(private readonly fleetService: FleetService) {}

  @GrpcMethod('FleetService', 'CreateFleet')
  async createFleet(request: CreateFleetRequest): Promise<Fleet> {
    return this.fleetService.createFleet(request);
  }

  @GrpcMethod('FleetService', 'GetFleet')
  async getFleet(request: GetFleetRequest): Promise<Fleet> {
    return this.fleetService.getFleet(request);
  }

  @GrpcMethod('FleetService', 'UpdateFleet')
  async updateFleet(request: UpdateFleetRequest): Promise<Fleet> {
    return this.fleetService.updateFleet(request);
  }

  @GrpcMethod('FleetService', 'DeleteFleet')
  async deleteFleet(request: DeleteFleetRequest): Promise<DeleteFleetResponse> {
    return this.fleetService.deleteFleet(request);
  }

  @GrpcMethod('FleetService', 'ListFleets')
  async listFleets(request: ListFleetsRequest): Promise<any> {
    return this.fleetService.listFleets(request);
  }

  @GrpcMethod('FleetService', 'AssignDriver')
  async assignDriver(request: AssignDriverRequest): Promise<Fleet> {
    return this.fleetService.assignDriver(request);
  }

  @GrpcMethod('FleetService', 'TrackFleet')
  async trackFleet(request: TrackFleetRequest): Promise<Fleet> {
    return this.fleetService.trackFleet(request);
  }
}
