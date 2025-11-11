import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from '@app/vehiclemanagement/infrastructure/vehicles-response';
import {ModelsAssembler} from '@app/vehiclemanagement/infrastructure/models-assembler';

export class VehiclesAssembler implements BaseAssembler<Vehicle, VehicleResource, VehiclesResponse> {

  private modelsAssembler = new ModelsAssembler();

  toEntitiesFromResponse(response: VehiclesResponse): Vehicle[] {
    if (!response || !response.vehicles) return [];
    return response.vehicles.map(res => this.toEntityFromResource(res as VehicleResource));
  }

  toEntityFromResource(resource: VehicleResource): Vehicle {
    const modelEntity = resource.model ? this.modelsAssembler.toEntityFromResource(resource.model) : null;

    return new Vehicle({
      id: resource.id,
      ownerId: resource.ownerId,
      model: modelEntity,
      plate: resource.plate,
      year: resource.year
    });
  }

  toResourceFromEntity(entity: Vehicle): VehicleResource {
    const modelResource = entity.model ? this.modelsAssembler.toResourceFromEntity(entity.model) : null;

    return {
      id: entity.id,
      ownerId: entity.ownerId,
      model: modelResource,
      plate: entity.plate,
      year: entity.year
    } as VehicleResource;
  }

}
