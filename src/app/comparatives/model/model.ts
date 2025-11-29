// Re-export and adapt from vehiclemanagement to maintain compatibility
import { Vehicle as VehicleEntity, Model as ModelEntity } from '@app/vehiclemanagement/domain/model/vehicle.entity';

export class Model {
  id: number = 0;
  name: string = '';
  brand: string = '';
  modelYear: string = '';
  originCountry: string = '';
  producedAt: string = '';
  type: string = '';
  displacement: string = '';
  potency: string = '';
  engineType: string = '';
  engineTorque: string = '';
  weight: string = '';
  transmission: string = '';
  brakes: string = '';
  tank: string = '';
  seatHeight: string = '';
  consumption: string = '';
  price: string = '';
  oilCapacity: string = '';
  connectivity: string = '';
  durability: string = '';
  octane: string = '';

  [key: string]: any;

  constructor(data: Partial<ModelEntity> | ModelEntity | null = {}) {
    if (!data) {
      return;
    }

    this.id = data.id ?? 0;
    this.name = data.name ?? '';
    this.brand = data.brand ?? '';
    this.modelYear = data.modelYear ?? '';
    this.originCountry = data.originCountry ?? '';
    this.producedAt = data.producedAt ?? '';
    this.type = data.type ?? '';
    this.displacement = data.displacement ?? '';
    this.potency = data.potency ?? '';
    this.engineType = data.engineType ?? '';
    this.engineTorque = data.engineTorque ?? '';
    this.weight = data.weight ?? '';
    this.transmission = data.transmission ?? '';
    this.brakes = data.brakes ?? '';
    this.tank = data.tank ?? '';
    this.seatHeight = data.seatHeight ?? '';
    this.consumption = data.consumption ?? '';
    this.price = data.price?.toString() ?? '';
    this.oilCapacity = data.oilCapacity ?? '';
    this.connectivity = data.connectivity ?? '';
    this.durability = data.durability ?? '';
    this.octane = data.octane ?? '';
  }
}

export class Vehicle {
  id: number = 0;
  ownerId: number = 0;
  model: Model;
  year: string = '';
  plate: string = '';

  constructor(data?: {
    id?: number;
    ownerId?: number;
    model?: Partial<ModelEntity> | ModelEntity | null;
    year?: string;
    plate?: string;
  }) {
    if (!data) {
      this.model = new Model();
      return;
    }

    this.id = data.id ?? 0;
    this.ownerId = data.ownerId ?? 0;
    this.model = new Model(data.model ?? null);
    this.year = data.year ?? '';
    this.plate = data.plate ?? '';
  }

  // Static method to convert from VehicleEntity
  static fromEntity(entity: VehicleEntity): Vehicle {
    return new Vehicle({
      id: entity.id,
      ownerId: entity.owner?.id,
      model: entity.model,
      year: entity.year,
      plate: entity.plate
    });
  }
}
