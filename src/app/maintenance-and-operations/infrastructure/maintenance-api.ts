import {BaseApi} from '@app/shared/infrastructure/base-api';
import {Injectable} from '@angular/core';
import {MaintenanceApiEndpoint} from '@app/maintenance-and-operations/infrastructure/maintenance-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {MaintenanceAssembler} from '@app/maintenance-and-operations/infrastructure/maintenance-assembler';
import {map, Observable} from 'rxjs';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {MaintenanceResource, MaintenancesResponse} from '@app/maintenance-and-operations/infrastructure/maintenance-response';

@Injectable({providedIn: 'root'})
export class MaintenanceApi extends BaseApi {
  private readonly maintenanceEndpoint: MaintenanceApiEndpoint;
  private readonly httpClient: HttpClient;
  private readonly assembler = new MaintenanceAssembler();

  constructor(http: HttpClient) {
    super();
    this.httpClient = http;
    this.maintenanceEndpoint = new MaintenanceApiEndpoint(http);
  }

  /**
   * Gets a maintenance by ID
   * @param maintenanceId - The ID of the maintenance
   * @returns Observable of the Maintenance entity
   */
  getMaintenanceById(maintenanceId: number): Observable<Maintenance> {
    return this.maintenanceEndpoint.getMaintenanceById(maintenanceId).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  /**
   * Gets all maintenances by mechanic ID
   * @param mechanicId - The ID of the mechanic
   * @returns Observable of array of Maintenance entities
   */
  getMaintenancesByMechanicId(mechanicId: number): Observable<Maintenance[]> {
    return this.maintenanceEndpoint.getMaintenancesByMechanicId(mechanicId).pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.assembler.toEntityFromResource(resource))
          : this.assembler.toEntitiesFromResponse(response as MaintenancesResponse)
      )
    );
  }

  /**
   * Gets all maintenances by vehicle ID
   * @param vehicleId - The ID of the vehicle
   * @returns Observable of array of Maintenance entities
   */
  getMaintenancesByVehicleId(vehicleId: number): Observable<Maintenance[]> {
    return this.maintenanceEndpoint.getMaintenancesByVehicleId(vehicleId).pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.assembler.toEntityFromResource(resource))
          : this.assembler.toEntitiesFromResponse(response as MaintenancesResponse)
      )
    );
  }

  /**
   * Creates a new maintenance
   * @param maintenance - The maintenance to create (without ID, state, and expense)
   * @returns Observable of the created Maintenance entity
   */
  createMaintenance(maintenance: Omit<Maintenance, 'id' | 'state' | 'expense'>): Observable<Maintenance> {
    const resource = this.assembler.toResourceFromEntity(maintenance as Maintenance);
    const { id, state, expense, ...resourceWithoutIdStateExpense } = resource;

    return this.maintenanceEndpoint.createMaintenance(resourceWithoutIdStateExpense).pipe(
      map(createdResource => this.assembler.toEntityFromResource(createdResource))
    );
  }

  /**
   * Deletes a maintenance by ID
   * @param maintenanceId - The ID of the maintenance
   * @returns Observable of void
   */
  deleteMaintenance(maintenanceId: number): Observable<void> {
    return this.maintenanceEndpoint.deleteMaintenance(maintenanceId);
  }

  /**
   * Updates maintenance status by ID
   * @param maintenanceId - The ID of the maintenance
   * @param newStatus - The new status to set
   * @returns Observable of the updated Maintenance entity
   */
  updateMaintenanceStatus(maintenanceId: number, newStatus: string): Observable<Maintenance> {
    return this.maintenanceEndpoint.updateMaintenanceStatus(maintenanceId, newStatus).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  /**
   * Assigns an expense to a maintenance
   * @param maintenanceId - The ID of the maintenance
   * @param expenseId - The ID of the expense
   * @returns Observable of the updated Maintenance entity
   */
  assignExpenseToMaintenance(maintenanceId: number, expenseId: number): Observable<Maintenance> {
    return this.maintenanceEndpoint.assignExpenseToMaintenance(maintenanceId, expenseId).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }


  getMaintenancesByOwnerId(ownerId: number): Observable<Maintenance[]> {
    return this.maintenanceEndpoint.getMaintenancesByOwnerId(ownerId).pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.assembler.toEntityFromResource(resource))
          : this.assembler.toEntitiesFromResponse(response as MaintenancesResponse)
      )
    );
  }
}

