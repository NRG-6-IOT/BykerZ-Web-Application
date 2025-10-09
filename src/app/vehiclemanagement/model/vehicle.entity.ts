export class Vehicle {
  id: number;
  ownerId: number;
  vin: string;
  plateNumber: string;
  model: string;
  brand: string;
  status: string;
  year: string;
  color: string;
  authorizedMechanicId: number;

  constructor(vehicle: {
    id: number,
    ownerId: number,
    vin: string,
    plateNumber: string,
    model: string,
    brand: string,
    status: string,
    year: string,
    color: string,
    authorizedMechanicId: number,
  }) {
    this.id = vehicle.id;
    this.ownerId = vehicle.ownerId;
    this.vin = vehicle.vin;
    this.plateNumber = vehicle.plateNumber;
    this.model = vehicle.model;
    this.brand = vehicle.brand;
    this.status = vehicle.status;
    this.year = vehicle.year;
    this.color = vehicle.color;
    this.authorizedMechanicId = vehicle.authorizedMechanicId;
  }
}
