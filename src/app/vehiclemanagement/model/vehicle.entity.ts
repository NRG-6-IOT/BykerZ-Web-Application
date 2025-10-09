export class Vehicle {
  brand: string;
  model: string;
  plate: string;
  type: string;
  modelYear: string;
  brandOrigin: string;
  fabricationCountry: string;
  displacement: number;
  octane: number;

  constructor(vehicle: {
    brand: string,
    model: string,
    plate: string,
    type: string,
    modelYear: string,
    brandOrigin: string,
    fabricationCountry: string,
    displacement: number,
    octane: number,
  }) {
    this.brand = vehicle.brand || "";
    this.model = vehicle.model;
    this.plate = vehicle.plate;
    this.type = vehicle.type;
    this.modelYear = vehicle.modelYear;
    this.brandOrigin = vehicle.brandOrigin;
    this.fabricationCountry = vehicle.fabricationCountry;
    this.displacement = vehicle.displacement;
    this.octane = vehicle.octane;
  }
}
