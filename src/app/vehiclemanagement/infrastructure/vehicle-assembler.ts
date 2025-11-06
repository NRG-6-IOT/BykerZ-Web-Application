import {VehicleResource, VehiclesResponse} from '@app/vehiclemanagement/infrastructure/vehicles-response';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';

export class VehicleAssembler {
  static toEntityFromResource(resource: VehicleResource): Vehicle {
    return {
      id: resource.id,
      ownerId: resource.ownerId,
      mechanicId: resource.mechanicId,
      model: {
        id: resource.model.id,
        name: resource.model.name,
        brand: resource.model.brand,
        modelYear: resource.model.modelYear,
        originCountry: resource.model.originCountry,
        producedAt: resource.model.producedAt,
        type: resource.model.type,
        displacement: resource.model.displacement,
        potency: resource.model.potency,
        engineType: resource.model.engineType,
        engineTorque: resource.model.engineTorque,
        weight: resource.model.weight,
        transmission: resource.model.transmission,
        brakes: resource.model.brakes,
        tank: resource.model.tank,
        seatHeight: resource.model.seatHeight,
        consumption: resource.model.consumption,
        price: resource.model.price,
        oilCapacity: resource.model.oilCapacity,
        connectivity: resource.model.connectivity,
        durability: resource.model.durability,
        octane: resource.model.octane,
      },
      year: resource.year,
      plate: resource.plate,
    }
  }

  static toEntitiesFromResources(response: VehiclesResponse): Vehicle[] {
    return response.vehicles.map(this.toEntityFromResource);
  }
}
