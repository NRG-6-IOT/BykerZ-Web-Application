import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {Model} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {ModelResource, ModelsResponse} from '@app/vehiclemanagement/infrastructure/vehicles-response';

export class ModelsAssembler implements BaseAssembler<Model, ModelResource, ModelsResponse> {
  toEntitiesFromResponse(response: ModelsResponse): Model[] {
    if (!response || !response.models) return [];
    return response.models.map(res => this.toEntityFromResource(res as ModelResource));
  }

  toEntityFromResource(resource: ModelResource): Model {
    return new Model({
      id: resource.id,
      name: resource.name,
      brand: resource.brand,
      modelYear: resource.modelYear,
      originCountry: resource.originCountry,
      producedAt: resource.producedAt,
      type: resource.type,
      displacement: resource.displacement,
      potency: resource.potency,
      engineType: resource.engineType,
      engineTorque: resource.engineTorque,
      weight: resource.weight,
      transmission: resource.transmission,
      brakes: resource.brakes,
      tank: resource.tank,
      seatHeight: resource.seatHeight,
      consumption: resource.consumption,
      price: resource.price,
      oilCapacity: resource.oilCapacity,
      connectivity: resource.connectivity,
      durability: resource.durability,
      octane: resource.octane
    });
  }

  toResourceFromEntity(entity: Model): ModelResource {
    return {
      id: entity.id,
      name: entity.name,
      brand:  entity.brand,
      modelYear: entity.modelYear,
      originCountry: entity.originCountry,
      producedAt: entity.producedAt,
      type: entity.type,
      displacement: entity.displacement,
      potency: entity.potency,
      engineType: entity.engineType,
      engineTorque: entity.engineTorque,
      weight: entity.weight,
      transmission: entity.transmission,
      brakes: entity.brakes,
      tank: entity.tank,
      seatHeight: entity.seatHeight,
      consumption: entity.consumption,
      price: entity.price,
      oilCapacity: entity.oilCapacity,
      connectivity: entity.connectivity,
      durability: entity.durability,
      octane: entity.octane
    }
  }

}
