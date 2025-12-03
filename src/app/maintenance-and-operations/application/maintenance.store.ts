import {inject, Injectable, signal} from '@angular/core';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {MaintenanceApi} from '@app/maintenance-and-operations/infrastructure/maintenance-api';
import {retry} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MaintenanceStore {
  // State signals
  private maintenancesSignal = signal<Maintenance[]>([]);
  private selectedMaintenanceSignal = signal<Maintenance | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  // Public readonly signals
  readonly maintenances = this.maintenancesSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();


  scheduledMaintenances(): Maintenance[] {
    const list = this.maintenancesSignal();
    return list.filter(m => m.state === 'PENDING' || m.state === 'IN_PROGRESS');
  }

  completedMaintenances(): Maintenance[] {
    const list = this.maintenancesSignal();
    return list.filter(m => m.state === 'COMPLETED' || m.state === 'CANCELLED');
  }

  private maintenanceApi = inject(MaintenanceApi);

  constructor() {
    this.reload();
  }

  reload(): void {
    const roleId = localStorage.getItem('role_id');
    const role = localStorage.getItem('user_role');

    if (!roleId || !role) {
      return;
    }

    const id = +roleId;
    if (role === 'ROLE_MECHANIC') {
      this.loadMaintenancesByMechanicId(id);
    } else if (role === 'ROLE_OWNER') {
      this.loadMaintenancesByOwnerId(id);
    }
  }

  /**
   * Loads a specific maintenance by ID
   * @param maintenanceId - The ID of the maintenance to load
   */
  loadMaintenanceById(maintenanceId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.getMaintenanceById(maintenanceId).pipe(retry(2)).subscribe({
      next: maintenance => {
        this.selectedMaintenanceSignal.set(maintenance);

        // Also update in the maintenances array if it exists
        const currentMaintenances = this.maintenancesSignal();
        const existingIndex = currentMaintenances.findIndex(m => m.id === maintenance.id);

        if (existingIndex >= 0) {
          const updatedMaintenances = [...currentMaintenances];
          updatedMaintenances[existingIndex] = maintenance;
          this.maintenancesSignal.set(updatedMaintenances);
        } else {
          this.maintenancesSignal.update(maintenances => [...maintenances, maintenance]);
        }

        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load maintenance'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all maintenances by mechanic ID
   * @param mechanicId - The ID of the mechanic
   */
  loadMaintenancesByMechanicId(mechanicId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.getMaintenancesByMechanicId(mechanicId).pipe(retry(2)).subscribe({
      next: maintenances => {
        this.maintenancesSignal.set(maintenances);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load maintenances by mechanic'));
        this.loadingSignal.set(false);
      }
    });
  }

  loadMaintenancesByOwnerId(ownerId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.getMaintenancesByOwnerId(ownerId).pipe(retry(2)).subscribe({
      next: maintenances => {
        this.maintenancesSignal.set(maintenances);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load maintenances by mechanic'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads all maintenances by vehicle ID
   * @param vehicleId - The ID of the vehicle
   */
  loadMaintenancesByVehicleId(vehicleId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.getMaintenancesByVehicleId(vehicleId).pipe(retry(2)).subscribe({
      next: maintenances => {
        // Merge new maintenances with existing ones, avoiding duplicates
        const currentMaintenances = this.maintenancesSignal();
        const updatedMaintenances = [...currentMaintenances];

        maintenances.forEach(newMaintenance => {
          const existingIndex = updatedMaintenances.findIndex(m => m.id === newMaintenance.id);
          if (existingIndex >= 0) {
            // Update existing maintenance
            updatedMaintenances[existingIndex] = newMaintenance;
          } else {
            // Add new maintenance
            updatedMaintenances.push(newMaintenance);
          }
        });

        this.maintenancesSignal.set(updatedMaintenances);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load maintenances by vehicle'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Creates a new maintenance
   * @param maintenance - The maintenance to create (without ID, state, and expense)
   */
  createMaintenance(maintenance: Omit<Maintenance, 'id' | 'state' | 'expense'>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.createMaintenance(maintenance).pipe(retry(2)).subscribe({
      next: createdMaintenance => {
        this.maintenancesSignal.update(maintenances => [createdMaintenance, ...maintenances]);
        this.selectedMaintenanceSignal.set(createdMaintenance);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create maintenance'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a maintenance by ID
   * @param maintenanceId - The ID of the maintenance to delete
   */
  deleteMaintenance(maintenanceId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.deleteMaintenance(maintenanceId).pipe(retry(1)).subscribe({
      next: () => {
        this.maintenancesSignal.update(maintenances => maintenances.filter(m => m.id !== maintenanceId));

        // Clear selected maintenance if it was deleted
        if (this.selectedMaintenanceSignal()?.id === maintenanceId) {
          this.selectedMaintenanceSignal.set(null);
        }

        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete maintenance'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates maintenance status by ID
   * @param maintenanceId - The ID of the maintenance
   * @param newStatus - The new status to set
   */
  updateMaintenanceStatus(maintenanceId: number, newStatus: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.updateMaintenanceStatus(maintenanceId, newStatus).pipe(retry(1)).subscribe({
      next: updatedMaintenance => {
        // Update in the maintenances array
        this.maintenancesSignal.update(maintenances =>
          maintenances.map(m => m.id === maintenanceId ? updatedMaintenance : m)
        );

        // Update selected if it's the one being modified
        if (this.selectedMaintenanceSignal()?.id === maintenanceId) {
          this.selectedMaintenanceSignal.set(updatedMaintenance);
        }

        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update maintenance status'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Assigns an expense to a maintenance
   * @param maintenanceId - The ID of the maintenance
   * @param expenseId - The ID of the expense
   */
  assignExpenseToMaintenance(maintenanceId: number, expenseId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.maintenanceApi.assignExpenseToMaintenance(maintenanceId, expenseId).pipe(retry(1)).subscribe({
      next: updatedMaintenance => {
        // Update in the maintenances array
        this.maintenancesSignal.update(maintenances =>
          maintenances.map(m => m.id === maintenanceId ? updatedMaintenance : m)
        );

        // Update selected if it's the one being modified
        if (this.selectedMaintenanceSignal()?.id === maintenanceId) {
          this.selectedMaintenanceSignal.set(updatedMaintenance);
        }

        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to assign expense to maintenance'));
        this.loadingSignal.set(false);
      }
    });
  }


  /**
   * Resets the entire store state (useful for sign-out)
   */
  reset(): void {
    this.maintenancesSignal.set([]);
    this.selectedMaintenanceSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }

  /**
   * Formats error messages for user-friendly display
   * @param error - The error object
   * @param fallback - Fallback message if error cannot be parsed
   * @returns Formatted error message
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}

