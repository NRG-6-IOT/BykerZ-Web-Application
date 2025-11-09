import {BaseApi} from '@app/shared/infrastructure/base-api';
import {Injectable} from '@angular/core';
import {AssignmentsApiEndpoint} from '@app/assignments/infrastructure/assignments-api-endpoint';
import {MechanicApiEndpoint} from '@app/assignments/infrastructure/mechanic-api-endpoint';
import {OwnerApiEndpoint} from '@app/assignments/infrastructure/owner-api-endpoint';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AssignmentAssembler} from '@app/assignments/infrastructure/assignments-assembler';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AssignmentResource, AssignmentsResponse} from '@app/assignments/infrastructure/assignments-response';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';

@Injectable({providedIn: 'root'})
export class AssignmentsApi extends BaseApi{
  private readonly assignmentsEndpoint: AssignmentsApiEndpoint;
  private readonly mechanicsEndpoint: MechanicApiEndpoint;
  private readonly ownerEndpoint: OwnerApiEndpoint;
  private readonly httpClient: HttpClient;
  private readonly assembler = new AssignmentAssembler();

  constructor(http: HttpClient) {
    super();
    this.httpClient = http;
    this.assignmentsEndpoint = new AssignmentsApiEndpoint(http);
    this.mechanicsEndpoint = new MechanicApiEndpoint(http);
    this.ownerEndpoint = new OwnerApiEndpoint(http);
  }

  getAssignmentsByMechanicAndStatus(mechanicId: number, status: string): Observable<Assignment[]> {
    return this.assignmentsEndpoint.getByMechanicAndStatus(mechanicId, status).pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.assembler.toEntityFromResource(resource))
          : this.assembler.toEntitiesFromResponse(response as AssignmentsResponse)
      )
    );
  }

  deleteAssignment(assignmentId: number): Observable<void> {
    return this.assignmentsEndpoint.delete(assignmentId);
  }

  createAssignment(mechanicId: number): Observable<Assignment> {
    return this.assignmentsEndpoint.createAssignment(mechanicId).pipe(
      map(response => {
        if (Array.isArray(response)) {
          throw new Error('Expected a single AssignmentResource, but received an array.');
        }
        return this.assembler.toEntityFromResource(response as AssignmentResource);
      })
    );
  }

}
