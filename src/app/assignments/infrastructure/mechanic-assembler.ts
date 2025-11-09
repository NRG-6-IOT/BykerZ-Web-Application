import { Mechanic } from '@app/assignments/domain/model/mechanic.entity';
import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {MechanicResource, MechanicResponse} from '@app/assignments/infrastructure/mechanic-response';

export class MechanicAssembler implements BaseAssembler<Mechanic, MechanicResource, MechanicResponse> {
  toEntitiesFromResponse(response: MechanicResponse): Mechanic[] {
    if (!response || !response.mechanic) return [];
    return [this.toEntityFromResource(response.mechanic as MechanicResource)];
  }

  toEntityFromResource(resource: MechanicResource): Mechanic {
    return new Mechanic({ mechanicId: resource.mechanicId, completeName: resource.completeName });
  }

  toResourceFromEntity(entity: Mechanic): MechanicResource {
    return {
      mechanicId: entity.id,
      completeName: entity.completeName
    } as MechanicResource;
  }
}
