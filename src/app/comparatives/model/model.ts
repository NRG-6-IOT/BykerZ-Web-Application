export class Model {
  id: number = 0;
  name: string = '';
  brand?: string;
  modelYear?: string;
  originCountry?: string;
  producedAt?: string;
  type?: string;
  displacement?: string;
  potency?: string;
  engineType?: string;
  engineTorque?: string;
  weight?: string;
  transmission?: string;
  brakes?: string;
  tank?: string;
  seatHeight?: string;
  consumption?: string;
  price?: string;
  oilCapacity?: string;
  connectivity?: string;
  durability?: string;
  octane?: string;

  [key: string]: any;

  constructor(data: Partial<Model> = {}) {
    Object.assign(this, data);
  }
}

export class Vehicle {
  id: number = 0;
  ownerId?: number;
  mechanicId?: number;
  model: Model;
  year?: string;
  plate?: string;

  constructor(data: Partial<Vehicle> & { model?: Partial<Model> } = {}) {
    this.id = data.id ?? 0;
    this.ownerId = data.ownerId;
    this.mechanicId = data.mechanicId;
    this.model = new Model(data.model ?? {});
    this.year = data.year;
    this.plate = data.plate;
  }
}
