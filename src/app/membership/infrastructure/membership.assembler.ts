// src/app/membership/infrastructure/membership-assembler.ts
import { MechanicResource, Mechanic } from './membership.response';
import { MembershipType } from '../domain/membership-type.enum';

export class MembershipAssembler {
  static toEntityFromResource(resource: MechanicResource): Mechanic {
    return {
      id: resource.mechanicId,
      completeName: resource.completeName,
      membershipType: resource.membershipType
    };
  }

  static toResourceFromEntity(entity: Mechanic): MechanicResource {
    return {
      mechanicId: entity.id,
      completeName: entity.completeName,
      membershipType: entity.membershipType
    };
  }
}
