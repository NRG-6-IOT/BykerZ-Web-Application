import { Owner } from '@app/assignments/domain/model/owner.entity';
import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {OwnerResource, OwnerResponse} from '@app/assignments/infrastructure/owner-response';

export class OwnerAssembler implements BaseAssembler<Owner, OwnerResource, OwnerResponse> {
  toEntitiesFromResponse(response: OwnerResponse): Owner[] {
    if (!response || !response.owner) return [];
    return [this.toEntityFromResource(response.owner as OwnerResource)];
  }

  toEntityFromResource(resource: OwnerResource): Owner {
    const completeName = resource.completeName ?? '';
    return new Owner({ id: resource.id, completeName });
  }

  toResourceFromEntity(entity: Owner): OwnerResource {
    return {
      id: entity.id,
      completeName: entity.completeName
    } as OwnerResource;
  }
}
