import {Owner} from '@app/assignments/domain/model/owner.entity';

export class Vehicle {
  id: number;
  owner: Owner | null;
  model: Model | null;
  year: string;
  plate: string;

  constructor(vehicle: { year: string; model: Model | null; plate: string; id: number; owner: Owner | null }) {
    this.id = vehicle.id || 0;
    this.owner = vehicle.owner;
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
  engineType: string;
  engineTorque: string;
  weight: string;
  transmission: string;
  brakes: string;
  tank: string;
  seatHeight: string;
  consumption: string;
  price: string;
  oilCapacity: string;
  connectivity: string;
  durability: string;
  octane: string;

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
    engineType: string,
    engineTorque: string,
    weight: string,
    transmission: string,
    brakes: string,
    tank: string,
    seatHeight: string,
    consumption: string,
    price: string,
    oilCapacity: string,
    connectivity: string
    durability: string,
    octane: string,
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
    this.engineType = model.engineType;
    this.engineTorque = model.engineTorque;
    this.weight = model.weight;
    this.transmission = model.transmission;
    this.brakes = model.brakes;
    this.tank = model.tank;
    this.seatHeight = model.seatHeight;
    this.consumption = model.consumption;
    this.price = model.price;
    this.oilCapacity = model.oilCapacity;
    this.connectivity = model.connectivity;
    this.durability = model.durability;
    this.octane = model.octane;
  }

}
