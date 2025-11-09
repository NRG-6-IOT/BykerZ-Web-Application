import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';
import {OwnerResource} from '@app/assignments/infrastructure/owner-response';
import {MechanicResource} from '@app/assignments/infrastructure/mechanic-response';

export interface AssignmentResource extends BaseResource {
  id: number;
  owner?: OwnerResource | null;
  mechanic?: MechanicResource | null;
  type: string;
  status: string;
  assignmentCode: string;
  createdAt: string;
}

export interface AssignmentResponse extends BaseResponse {
  assignment: AssignmentResource;
}

export interface AssignmentsResponse extends BaseResponse {
  assignments: AssignmentResource[];
}
