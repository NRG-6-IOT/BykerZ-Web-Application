import {Component, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateExpenseDialog} from '@app/maintenance-and-operations/presentation/components/create-expense-dialog/create-expense-dialog';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';

@Component({
  selector: 'app-mechanic-maintenance-page',
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="screen p-10 relative">
      <!-- Loading State -->
      @if (maintenanceStore.loading()) {
        <div class="text-center text-gray-500 py-8">
          Loading maintenances...
        </div>
      }

      <!-- Error State -->
      @if (maintenanceStore.error()) {
        <div class="text-center text-red-500 py-8">
          {{maintenanceStore.error()}}
        </div>
      }

      <!-- Header with Create Button -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Scheduled Maintenances</h1>
        <button
          (click)="navigateToCreateMaintenance()"
          class="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold">
          Create Maintenance
        </button>
      </div>

      <!-- Scheduled Maintenances Section -->
      <div class="flex flex-col gap-4 mb-8">
        @if (scheduledMaintenances().length === 0 && !maintenanceStore.loading()) {
          <p class="text-gray-500">No scheduled maintenances</p>
        }
        @for (maintenance of scheduledMaintenances(); track maintenance.id) {
          <div class="bg-[#FF6B35] rounded-2xl p-2">
            <div class="bg-white text-black rounded-xl p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="font-semibold">Date & Time:</p>
                  <p>{{maintenance.dateOfService | date:'medium'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Location:</p>
                  <p>{{maintenance.location}}</p>
                </div>
                <div>
                  <p class="font-semibold">Mechanic:</p>
                  <p>Mechanic #{{maintenance.mechanicId}}</p>
                </div>
                <div>
                  <p class="font-semibold">Vehicle:</p>
                  <p>Vehicle #{{maintenance.vehicleId}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Details:</p>
                  <p>{{maintenance.details}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Status:</p>
                  <div class="flex gap-2 items-center mt-2">
                    <select
                      [(ngModel)]="maintenance.state"
                      class="px-3 py-2 border rounded-lg text-black font-semibold"
                      [ngClass]="{
                        'bg-yellow-200 text-yellow-800': maintenance.state === 'PENDING',
                        'bg-blue-200 text-blue-800': maintenance.state === 'IN_PROGRESS',
                        'bg-green-200 text-green-800': maintenance.state === 'COMPLETED',
                        'bg-red-200 text-red-800': maintenance.state === 'CANCELLED'
                      }">
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <button
                      (click)="saveMaintenanceState(maintenance)"
                      [disabled]="maintenanceStore.loading()"
                      class="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Completed Maintenances Section -->
      <h1 class="text-3xl font-bold mb-4">Maintenances Done</h1>
      <div class="flex flex-col gap-4 mb-4">
        @if (completedMaintenances().length === 0 && !maintenanceStore.loading()) {
          <p class="text-gray-500">No completed maintenances</p>
        }
        @for (maintenance of completedMaintenances(); track maintenance.id) {
          <div class="bg-[#FF6B35] rounded-2xl p-2">
            <div class="bg-white text-black rounded-xl p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="font-semibold">Date & Time:</p>
                  <p>{{maintenance.dateOfService | date:'medium'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Location:</p>
                  <p>{{maintenance.location}}</p>
                </div>
                <div>
                  <p class="font-semibold">Mechanic:</p>
                  <p>Mechanic #{{maintenance.mechanicId}}</p>
                </div>
                <div>
                  <p class="font-semibold">Vehicle:</p>
                  <p>Vehicle #{{maintenance.vehicleId}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Details:</p>
                  <p>{{maintenance.details}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Status:</p>
                  <p class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                     [ngClass]="{
                       'bg-green-200 text-green-800': maintenance.state === 'COMPLETED',
                       'bg-red-200 text-red-800': maintenance.state === 'CANCELLED'
                     }">
                    {{maintenance.state}}
                  </p>
                </div>
                @if (maintenance.expense) {
                  <div class="col-span-2">
                    <p class="font-semibold">Expense:</p>
                    <p>{{maintenance.expense.name}} - $ {{maintenance.expense.finalPrice | number:'1.2-2'}}</p>
                  </div>
                  <div class="col-span-2">
                    <button
                      (click)="navigateToExpenseDetails(maintenance.expense.id)"
                      class="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold">
                      See Expense Details
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class MechanicMaintenancePage implements OnInit {
  readonly maintenanceStore = inject(MaintenanceStore);
  readonly expenseStore = inject(ExpenseStore);
  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly http = inject(HttpClient);

  // Computed signals from the store
  readonly scheduledMaintenances = computed(() => this.maintenanceStore.scheduledMaintenances());
  readonly completedMaintenances = computed(() => this.maintenanceStore.completedMaintenances());

  ngOnInit(): void {
    this.loadMaintenances();
  }

  private loadMaintenances(): void {
    const roleId = localStorage.getItem('role_id');
    if (!roleId) {
      console.error('Mechanic ID not found');
      return;
    }

    const mechanicId = parseInt(roleId, 10);
    this.maintenanceStore.loadMaintenancesByMechanicId(mechanicId);
  }

  saveMaintenanceState(maintenance: Maintenance): void {
    console.log('Saving maintenance state:', maintenance);

    if (maintenance.state === 'COMPLETED') {
      this.handleCompletedState(maintenance);
    } else if (maintenance.state === 'IN_PROGRESS' || maintenance.state === 'CANCELLED') {
      this.maintenanceStore.updateMaintenanceStatus(maintenance.id, maintenance.state);
    }
  }

  private handleCompletedState(maintenance: Maintenance): void {
    const dialogRef = this.dialog.open(CreateExpenseDialog, {
      width: 'auto',
      maxWidth: 'none',
      disableClose: false,
      panelClass: 'custom-expense-dialog'
    });

    dialogRef.afterClosed().subscribe((expenseData: any) => {
      if (expenseData) {
        this.createExpenseForMaintenance(maintenance, expenseData);
      } else {
        // Revert state if dialog was cancelled
        maintenance.state = 'IN_PROGRESS';
      }
    });
  }

  private createExpenseForMaintenance(maintenance: Maintenance, expenseData: any): void {
    console.log('Expense data received:', expenseData);

    // Get owner ID via vehicle endpoint
    this.getOwnerIdByVehicleId(maintenance.vehicleId).subscribe({
      next: ({id , completeName}) => {
        // Ensure expenseType is MAINTENANCE for mechanic-created expenses
        const expenseToCreate = {
          ...expenseData,
          expenseType: 'MAINTENANCE'
        };

        // Create expense
        this.expenseStore.createExpense(id, expenseToCreate);

        // Wait a bit for the expense to be created, then get the latest expense
        setTimeout(() => {
          const expenses = this.expenseStore.expenses();
          if (expenses.length > 0) {
            const createdExpense = expenses[0]; // Most recent expense
            console.log('Created expense:', createdExpense);

            // Assign expense to maintenance
            this.maintenanceStore.assignExpenseToMaintenance(maintenance.id, createdExpense.id);

            // Update maintenance status to COMPLETED
            setTimeout(() => {
              this.maintenanceStore.updateMaintenanceStatus(maintenance.id, 'COMPLETED');
            }, 500);
          }
        }, 500);
      },
      error: (error) => {
        console.error('Error getting owner ID:', error);
        maintenance.state = 'IN_PROGRESS';
      }
    });
  }

  private getOwnerIdByVehicleId(vehicleId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*'
    });

    return this.http.get<{id: number, completeName: string}>(
      `${environment.platformProviderApiBaseUrl}/owners/vehicle/${vehicleId}`,
      { headers }
    );
  }

  navigateToExpenseDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }

  navigateToCreateMaintenance(): void {
    this.router.navigate(['/maintenances/mechanic/create']);
  }
}


