export class Vehicle {
  id: number;
  ownerId: number;
  mechanicId: number;
  model: Model;
  year: string;
  plate: string;

  constructor(vehicle: {
    id?: number,
    ownerId: number,
    mechanicId: number,
    model: Model,
    year: string,
    plate: string,
  }) {
    this.id = vehicle.id || 0;
    this.ownerId = vehicle.ownerId;
    this.mechanicId = vehicle.mechanicId;
    this.model = vehicle.model;
    this.year = vehicle.year;
    this.plate = vehicle.plate;
  }
}

export class Model {
  id: number;
  name: string;
  brand: string;
  modelYear: string;
  originCountry: string;
  producedAt: string;
  type: string;

  displacement: string;
  potency: string;
  engineTorque: string;
  weight: string;
  transmission: string;
  brakes: string;
  tank: string;
  seatHeight: string;
  consumption: string;
  price: string;

  constructor(model: {
    id: number,
    name: string,
    brand: string,
    modelYear: string,
    originCountry: string,
    producedAt: string,
    type: string,
    displacement: string,
    potency: string,
    engineTorque: string,
    weight: string,
    transmission: string,
    brakes: string,
    tank: string,
    seatHeight: string,
    consumption: string,
    price: string,
  }) {
    this.id = model.id;
    this.name = model.name;
    this.brand = model.brand;
    this.modelYear = model.modelYear;
    this.originCountry = model.originCountry;
    this.producedAt = model.producedAt;
    this.type = model.type;
    this.displacement = model.displacement;
    this.potency = model.potency;
    this.engineTorque = model.engineTorque;
    this.weight = model.weight;
    this.transmission = model.transmission;
    this.brakes = model.brakes;
    this.tank = model.tank;
    this.seatHeight = model.seatHeight;
    this.consumption = model.consumption;
    this.price = model.price;
  }

}
