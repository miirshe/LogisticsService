import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeliveryModule } from './delivery/delivery.module';
import { FleetController } from './fleet/fleet.controller';
import { FleetService } from './fleet/fleet.service';
import { FleetModule } from './fleet/fleet.module';
import { RouteModule } from './route/route.module';
import { WarehouseService } from './warehouse/warehouse.service';
import { WarehouseModule } from './warehouse/warehouse.module';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [DeliveryModule, FleetModule, RouteModule, WarehouseModule, InventoryModule],
  controllers: [AppController, FleetController],
  providers: [AppService, FleetService, WarehouseService],
})
export class AppModule {}
