import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {MatIcon} from '@angular/material/icon';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {RouterLink} from '@angular/router';
@Component({
  selector: 'app-dashboard-mechanic-page',
  imports: [
    NgOptimizedImage,
    MatIcon,
    RouterLink
  ],
  templateUrl: './dashboard-mechanic-page.html',
  standalone: true,
  styleUrl: './dashboard-mechanic-page.css'
})
export class DashboardMechanicPage {

  private assignmentsStore = inject(AssignmentsStore);

  private maintenancesStore = inject(MaintenanceStore);

  private vehiclesStore = inject(VehiclesStore);

  get mechanicAssignments() {
    return this.assignmentsStore.activeAssignments;
  }

  get mechanicMaintenances() {
    return this.maintenancesStore.scheduledMaintenances;
  }

  getVehicleById(id: number) {
    return this.vehiclesStore.getVehicleById(id)
  }

}
