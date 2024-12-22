import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FleetController } from './fleet.controller';
import { FleetService } from './fleet.service';
import { Fleet, FleetSchema } from './schemas/fleet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Fleet.name, schema: FleetSchema }]),
  ],
  controllers: [FleetController],
  providers: [FleetService],
  exports: [FleetService],
})
export class FleetModule {}
