import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from '@app/vehiclemanagement/infrastructure/vehicles-response';
import {ModelsAssembler} from '@app/vehiclemanagement/infrastructure/models-assembler';
import {OwnerAssembler} from '@app/assignments/infrastructure/owner-assembler';

export class VehiclesAssembler implements BaseAssembler<Vehicle, VehicleResource, VehiclesResponse> {

  private modelsAssembler = new ModelsAssembler();
  private ownerAssembler = new OwnerAssembler();

  toEntitiesFromResponse(response: VehiclesResponse): Vehicle[] {
    if (!response || !response.vehicles) return [];
    return response.vehicles.map(res => this.toEntityFromResource(res as VehicleResource));
  }

  toEntityFromResource(resource: VehicleResource): Vehicle {
    const modelEntity = resource.model ? this.modelsAssembler.toEntityFromResource(resource.model) : null;
    const ownerEntity = resource.owner ? this.ownerAssembler.toEntityFromResource(resource.owner) : null;

    return new Vehicle({
      id: resource.id,
      owner: ownerEntity,
      model: modelEntity,
      plate: resource.plate,
      year: resource.year
    });
  }

  toResourceFromEntity(entity: Vehicle): VehicleResource {
    const modelResource = entity.model ? this.modelsAssembler.toResourceFromEntity(entity.model) : null;
    const ownerResource = entity.owner ? this.ownerAssembler.toResourceFromEntity(entity.owner) : null;

    return {
      id: entity.id,
      owner: ownerResource,
      model: modelResource,
      plate: entity.plate,
      year: entity.year
    } as VehicleResource;
  }

}
