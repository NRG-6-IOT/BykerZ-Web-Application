import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {MaintenanceResource, MaintenancesResponse} from '@app/maintenance-and-operations/infrastructure/maintenance-response';
import {MaintenanceAssembler} from '@app/maintenance-and-operations/infrastructure/maintenance-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

const maintenanceEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderMaintenanceEndpointPath}`;

export class MaintenanceApiEndpoint extends BaseApiEndpoint<Maintenance, MaintenanceResource, MaintenancesResponse, MaintenanceAssembler> {
  constructor(http: HttpClient) {
    super(http, maintenanceEndpointUrl, new MaintenanceAssembler());
  }

  /**
   * Low-level HTTP call for: GET /api/v1/maintenance/{maintenanceId}
   * Gets a maintenance by ID
   */
  getMaintenanceById(maintenanceId: number): Observable<MaintenanceResource> {
    const url = `${this.endpointUrl}/${maintenanceId}`;
    return this.http.get<MaintenanceResource>(url).pipe(
      catchError(this.handleError(`Failed to fetch maintenance with id=${maintenanceId}`))
    );
  }

  /**
   * Low-level HTTP call for: GET /api/v1/maintenance/mechanic/{mechanicId}
   * Gets all maintenances by mechanic ID
   */
  getMaintenancesByMechanicId(mechanicId: number): Observable<MaintenancesResponse | MaintenanceResource[]> {
    const url = `${this.endpointUrl}/mechanic/${mechanicId}`;
    return this.http.get<MaintenancesResponse | MaintenanceResource[]>(url).pipe(
      catchError(this.handleError(`Failed to fetch maintenances for mechanicId=${mechanicId}`))
    );
  }

  /**
   * Low-level HTTP call for: GET /api/v1/maintenance/vehicle/{vehicleId}
   * Gets all maintenances by vehicle ID
   */
  getMaintenancesByVehicleId(vehicleId: number): Observable<MaintenancesResponse | MaintenanceResource[]> {
    const url = `${this.endpointUrl}/vehicle/${vehicleId}`;
    return this.http.get<MaintenancesResponse | MaintenanceResource[]>(url).pipe(
      catchError(this.handleError(`Failed to fetch maintenances for vehicleId=${vehicleId}`))
    );
  }

  /**
   * Low-level HTTP call for: POST /api/v1/maintenance
   * Creates a new maintenance
   */
  createMaintenance(maintenanceResource: Omit<MaintenanceResource, 'id' | 'state' | 'expense'>): Observable<MaintenanceResource> {
    return this.http.post<MaintenanceResource>(this.endpointUrl, maintenanceResource).pipe(
      catchError(this.handleError('Failed to create maintenance'))
    );
  }

  /**
   * Low-level HTTP call for: DELETE /api/v1/maintenance/{maintenanceId}
   * Deletes a maintenance by ID
   */
  deleteMaintenance(maintenanceId: number): Observable<void> {
    const url = `${this.endpointUrl}/${maintenanceId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError(`Failed to delete maintenance with id=${maintenanceId}`))
    );
  }

  /**
   * Low-level HTTP call for: PUT /api/v1/maintenance/{maintenanceId}
   * Updates maintenance status by ID
   */
  updateMaintenanceStatus(maintenanceId: number, newStatus: string): Observable<MaintenanceResource> {
    const url = `${this.endpointUrl}/${maintenanceId}`;
    return this.http.put<MaintenanceResource>(url, { newStatus }).pipe(
      catchError(this.handleError(`Failed to update maintenance status for id=${maintenanceId}`))
    );
  }

  /**
   * Low-level HTTP call for: PUT /api/v1/maintenance/{maintenanceId}/expense/assign/{expenseId}
   * Assigns an expense to a maintenance
   */
  assignExpenseToMaintenance(maintenanceId: number, expenseId: number): Observable<MaintenanceResource> {
    const url = `${this.endpointUrl}/${maintenanceId}/expense/assign/${expenseId}`;
    return this.http.put<MaintenanceResource>(url, null).pipe(
      catchError(this.handleError(`Failed to assign expense ${expenseId} to maintenance ${maintenanceId}`))
    );
  }
}


