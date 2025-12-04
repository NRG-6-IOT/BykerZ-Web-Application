import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {AssignmentResource, AssignmentsResponse} from '@app/assignments/infrastructure/assignments-response';
import {OwnerAssembler} from '@app/assignments/infrastructure/owner-assembler';
import {MechanicAssembler} from '@app/assignments/infrastructure/mechanic-assembler';

export class AssignmentAssembler implements BaseAssembler<Assignment, AssignmentResource, AssignmentsResponse> {
  private ownerAssembler = new OwnerAssembler();
  private mechanicAssembler = new MechanicAssembler();

  toEntitiesFromResponse(response: AssignmentsResponse): Assignment[] {
    if (!response || !response.assignments) return [];
    return response.assignments.map(res => this.toEntityFromResource(res as AssignmentResource));
  }

  toEntityFromResource(resource: AssignmentResource): Assignment {
    const ownerEntity = resource.owner ? this.ownerAssembler.toEntityFromResource(resource.owner) : null;
    const mechanicEntity = resource.mechanic ? this.mechanicAssembler.toEntityFromResource(resource.mechanic) : null;

    return new Assignment({
      id: resource.id,
      owner: ownerEntity ? { id: ownerEntity.id, completeName: ownerEntity.completeName } : null,
      mechanic: mechanicEntity ? { mechanicId: mechanicEntity.id, completeName: mechanicEntity.completeName } : null,
      type: resource.type,
      status: resource.status,
      assignmentCode: resource.assignmentCode,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: Assignment): AssignmentResource {
    return {
      id: entity.id,
      owner: entity.owner ? { id: entity.owner.id, completeName: entity.owner.completeName } : null,
      mechanic: entity.mechanic ? { mechanicId: entity.mechanic.id, completeName: entity.mechanic.completeName } : null,
      type: entity.type,
      status: entity.status,
      assignmentCode: entity.assignmentCode,
      createdAt: entity.createdAt
    } as AssignmentResource;
  }
}
