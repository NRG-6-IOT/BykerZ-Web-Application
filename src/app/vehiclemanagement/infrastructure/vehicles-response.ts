export interface VehiclesResponse {
  vehicles: VehicleResource[];
}

export interface VehicleResource {
  id: number;
  ownerId: number;
  mechanicId: number;
  model: ModelResource;
  year: string;
  plate: string;
}

export interface ModelResource {
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
}
