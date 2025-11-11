import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';

export interface VehicleResource extends BaseResource {
  id: number;
  ownerId: number;
  model: ModelResource;
  plate: string;
  year: string;
}

export interface ModelResource extends BaseResource {
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

export interface VehiclesResponse extends BaseResponse{
  vehicles: VehicleResource[];
}

export interface VehicleResponse extends BaseResponse {
  vehicle: VehicleResource;
}

export interface ModelsResponse extends BaseResponse {
  models: ModelResource[];
}

export interface ModelResponse extends BaseResponse {
  model: ModelResource;
}
