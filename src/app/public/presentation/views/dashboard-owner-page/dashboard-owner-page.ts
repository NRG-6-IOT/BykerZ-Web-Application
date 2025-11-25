import {Component, inject, OnInit} from '@angular/core';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';

@Component({
  selector: 'app-dashboard-owner-page',
  imports: [
  ],
  templateUrl: './dashboard-owner-page.html',
  standalone: true,
  styleUrl: './dashboard-owner-page.css'
})
export class DashboardOwnerPage implements OnInit {
  private store = inject(AssignmentsStore);

  private vehicleStore = inject(VehiclesStore);
  private maintenanceStore = inject(MaintenanceStore);
  private expenseStore = inject(ExpenseStore);

  ngOnInit() {
    this.store.getAssignmentByOwnerId(1);
  }

  get ownerAssignment() {
    return this.store.ownerAssignment;
  }

  get ownerVehicles() {
    return this.vehicleStore.vehicles;
  }
}
