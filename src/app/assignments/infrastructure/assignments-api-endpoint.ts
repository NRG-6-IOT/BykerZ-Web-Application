import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {AssignmentResource, AssignmentsResponse} from '@app/assignments/infrastructure/assignments-response';
import {AssignmentAssembler} from '@app/assignments/infrastructure/assignments-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

const assignmentEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderAssignmentsEndpointPath}`

export class AssignmentsApiEndpoint extends BaseApiEndpoint<Assignment,AssignmentResource, AssignmentsResponse, AssignmentAssembler>{
  constructor(http: HttpClient) {
    super( http, assignmentEndpointUrl, new AssignmentAssembler());
  };

  /**
   * Low-level HTTP call for: GET /api/v1/mechanic/{mechanicId}/assignments/{status}
   * Devuelve la respuesta cruda (puede ser objeto response o array de resources).
   */
  getByMechanicAndStatus(mechanicId: number, status: string): Observable<AssignmentsResponse | AssignmentResource[]> {
    const url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderMechanicEndpointPath}/${mechanicId}/assignments/${encodeURIComponent(status)}`;
    return this.http.get<AssignmentsResponse | AssignmentResource[]>(url).pipe(
      catchError(this.handleError(`Failed to fetch assignments for mechanicId=${mechanicId}, status=${status}`))
    );
  }

  createAssignment(mechanicId: number): Observable<AssignmentsResponse | AssignmentResource> {
    const url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderMechanicEndpointPath}/${mechanicId}/assignments`;
    return this.http.post<AssignmentsResponse | AssignmentResource>(url, {}).pipe(
      catchError(this.handleError(`Failed to create assignment for mechanicId=${mechanicId}`))
    );
  }

  updateAssignmentType(assignmentId: number, assignmentType: string): Observable<AssignmentsResponse | AssignmentResource> {
    const url = `${this.endpointUrl}/${assignmentId}/type`;
    return this.http.patch<AssignmentsResponse | AssignmentResource>(url, {type: assignmentType}).pipe(
      catchError(this.handleError(`Failed to update assignment type for assignmentId=${assignmentId}`))
    );
  }

  getByOwner(ownerId: number): Observable<AssignmentsResponse | AssignmentResource> {
    const url = `${environment.platformProviderApiBaseUrl}${environment.platformProviderOwnerEndpointPath}/${ownerId}/assignment`;
    return this.http.get<AssignmentsResponse | AssignmentResource>(url).pipe(
      catchError(this.handleError(`Failed to fetch assignments for ownerId=${ownerId}`))
    );
  }
}
