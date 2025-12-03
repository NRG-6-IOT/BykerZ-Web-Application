import {Component, inject, OnInit} from '@angular/core';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {DatePipe, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Vehicle} from '@app/comparatives/model/model';

@Component({
  selector: 'app-dashboard-owner-page',
  imports: [
    NgOptimizedImage,
    RouterLink,
    DatePipe
  ],
  templateUrl: './dashboard-owner-page.html',
  standalone: true,
  styleUrl: './dashboard-owner-page.css'
})
export class DashboardOwnerPage implements OnInit {
  private store = inject(AssignmentsStore);

  private vehiclesStore = inject(VehiclesStore);
  private maintenanceStore = inject(MaintenanceStore);
  private expenseStore = inject(ExpenseStore);

  ngOnInit() {
    const roleId = localStorage.getItem("role_id");
    if (roleId) {
      setTimeout(() => {
        this.store.getAssignmentByOwnerId(+roleId);
        this.vehiclesStore.loadVehiclesByOwner(+roleId);
        const vehicles = this.vehiclesStore.vehicles();
        console.log(vehicles);
        vehicles.forEach((vehicle) => {
          this.maintenanceStore.loadMaintenancesByVehicleId(vehicle.id);
        })
      }, 500)
    }
  }


  get ownerAssignment() {
    return this.store.ownerAssignment;
  }

  get ownerVehicles() {
    return this.vehiclesStore.vehicles;
  }

  get ownerExpenses() {
    return this.expenseStore.expenses;
  }

  get ownerMaintenances() {
    return this.maintenanceStore.maintenances;
  }

  getVehicleById(id: number) {
    return this.vehiclesStore.getVehicleById(id)
  }
}
