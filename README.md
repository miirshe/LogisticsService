# Logistics Microservice

A gRPC-based microservice for managing logistics operations, including fleet management, delivery tracking, warehouse operations, and route optimization.

## Features

- **Fleet Management**
  - Vehicle tracking and status monitoring
  - Driver management
  - Maintenance scheduling
  - Real-time GPS tracking

- **Delivery Management**
  - Parcel and food delivery support
  - Real-time delivery status updates
  - Pickup and delivery scheduling
  - Payment status tracking

- **Warehouse Operations**
  - Inventory management
  - Stock level monitoring
  - Warehouse capacity tracking
  - Item expiry management

- **Route Optimization**
  - Efficient delivery route planning
  - Real-time traffic consideration
  - Multiple waypoint support
  - Distance and time estimation

## Tech Stack

- **Framework**: NestJS
- **Protocol**: gRPC
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Protocol Buffers compiler (protoc)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/miirshe/LogisticsService.git
cd LogisticsService
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/logisticsDB
GRPC_URL=localhost:50051
```

4. Build the project:
```bash
npm run build
```

## Running the Service

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run start:prod
```

## API Documentation

### gRPC Services

#### Fleet Service
- `CreateFleet`: Create a new fleet vehicle
- `UpdateFleetLocation`: Update vehicle GPS location
- `GetFleet`: Retrieve fleet information

#### Delivery Service
- `CreateDelivery`: Create a new delivery
- `UpdateDeliveryStatus`: Update delivery status
- `GetDelivery`: Retrieve delivery information

#### Warehouse Service
- `CreateWarehouse`: Create a new warehouse
- `UpdateInventory`: Update warehouse inventory
- `GetWarehouse`: Retrieve warehouse information

#### Route Service
- `OptimizeRoute`: Generate optimized delivery route
- `UpdateRoute`: Update route information

## Database Schema

### Fleet Collection
- Vehicle Details (type, license, make, model)
- Driver Information
- Location Data
- Status Information

### Delivery Collection
- Delivery Type (parcel/food)
- Status
- Route Information
- Payment Details

### Warehouse Collection
- Basic Information
- Capacity Details
- Inventory Items

### Route Collection
- Waypoints
- Optimization Data
- Traffic Information

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact [miirshe@gmail.com](mailto:miirshe@gmail.com)