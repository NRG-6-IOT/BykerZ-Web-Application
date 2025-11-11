import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Maintenance} from '@app/maintenance/domain/model/maintenance.entity';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateExpenseDialogComponent} from '@app/maintenance/presentation/components/create-expense-dialog/create-expense-dialog.component';
import {MaintenanceService} from '@app/maintenance/infrastructure/maintenance.service';
import {ExpenseService} from '@app/maintenance/infrastructure/expense.service';
import {UserService} from '@app/iam/services/user.service';

@Component({
  selector: 'app-mechanic-maintenance-page',
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="w-full h-full p-10 relative">
      <!-- Scheduled Maintenances Section -->
      <h1 class="text-3xl font-bold mb-4">Scheduled Maintenances</h1>
      <div class="flex flex-col gap-4 mb-8">
        @if (scheduledMaintenances().length === 0) {
          <p class="text-gray-500">No scheduled maintenances</p>
        }
        @for (maintenance of scheduledMaintenances(); track maintenance.id) {
          <div class="bg-[#FF6B35] rounded-2xl p-2">
            <div class="bg-white text-black rounded-xl p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="font-semibold">Date & Time:</p>
                  <p>{{maintenance.dateOfService}}</p>
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
                      class="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold">
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
        @if (completedMaintenances().length === 0) {
          <p class="text-gray-500">No completed maintenances</p>
        }
        @for (maintenance of completedMaintenances(); track maintenance.id) {
          <div class="bg-[#FF6B35] rounded-2xl p-2">
            <div class="bg-white text-black rounded-xl p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="font-semibold">Date & Time:</p>
                  <p>{{maintenance.dateOfService}}</p>
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
export class MechanicMaintenancePageComponent implements OnInit {
  scheduledMaintenances = signal<Maintenance[]>([]);
  completedMaintenances = signal<Maintenance[]>([]);

  // Mock data
  private mockMaintenances: Maintenance[] = [
    {
      id: 1,
      details: 'Oil change and filter replacement',
      vehicleId: 101,
      dateOfService: '2025-11-15T10:00:00',
      location: 'Av. Javier Prado 2050, San Isidro 15036',
      description: 'Regular maintenance service',
      state: 'PENDING',
      expense: null,
      mechanicId: 1
    },
    {
      id: 2,
      details: 'Brake inspection and pad replacement',
      vehicleId: 102,
      dateOfService: '2025-11-12T14:30:00',
      location: 'Av. Universitaria 1801, San Miguel 15088',
      description: 'Brake system maintenance',
      state: 'IN_PROGRESS',
      expense: null,
      mechanicId: 1
    },
    {
      id: 3,
      details: 'Engine diagnostic and tune-up',
      vehicleId: 103,
      dateOfService: '2025-11-08T09:00:00',
      location: 'Jr. Talambo 135, San Miguel 15087',
      description: 'Complete engine service',
      state: 'COMPLETED',
      expense: {
        id: 1,
        name: 'Engine Service Expense',
        finalPrice: 450.50,
        expenseType: 'MAINTENANCE',
        items: [
          {
            id: 1,
            name: 'Engine Oil',
            amount: 4,
            unitPrice: 25.00,
            totalPrice: 100.00,
            itemType: 'SUPPLIES'
          },
          {
            id: 2,
            name: 'Oil Filter',
            amount: 1,
            unitPrice: 15.50,
            totalPrice: 15.50,
            itemType: 'SUPPLIES'
          },
          {
            id: 3,
            name: 'Labor',
            amount: 3,
            unitPrice: 45.00,
            totalPrice: 135.00,
            itemType: 'PAYMENT'
          },
          {
            id: 4,
            name: 'Diagnostic Tools',
            amount: 1,
            unitPrice: 200.00,
            totalPrice: 200.00,
            itemType: 'TOOLS'
          }
        ]
      },
      mechanicId: 1
    },
    {
      id: 4,
      details: 'Tire rotation and alignment',
      vehicleId: 104,
      dateOfService: '2025-11-05T11:00:00',
      location: 'Av. La Marina 2000, San Miguel 15087',
      description: 'Tire maintenance',
      state: 'CANCELLED',
      expense: null,
      mechanicId: 1
    },
    {
      id: 5,
      details: 'Transmission fluid change',
      vehicleId: 105,
      dateOfService: '2025-11-10T13:00:00',
      location: 'Av. Arequipa 4800, Miraflores 15048',
      description: 'Transmission service',
      state: 'COMPLETED',
      expense: {
        id: 2,
        name: 'Transmission Service',
        finalPrice: 320.00,
        expenseType: 'MAINTENANCE',
        items: [
          {
            id: 5,
            name: 'Transmission Fluid',
            amount: 5,
            unitPrice: 30.00,
            totalPrice: 150.00,
            itemType: 'SUPPLIES'
          },
          {
            id: 6,
            name: 'Filter',
            amount: 1,
            unitPrice: 20.00,
            totalPrice: 20.00,
            itemType: 'SUPPLIES'
          },
          {
            id: 7,
            name: 'Labor',
            amount: 3,
            unitPrice: 50.00,
            totalPrice: 150.00,
            itemType: 'PAYMENT'
          }
        ]
      },
      mechanicId: 1
    }
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private maintenanceService: MaintenanceService,
    private expenseService: ExpenseService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    // Get mechanic ID from user service
    this.userService.getMechanicId().subscribe({
      next: (response) => {
        const mechanicId = response.mechanicId;

        // Fetch all maintenances for this mechanic
        this.maintenanceService.getMaintenancesByMechanicId(mechanicId).subscribe({
          next: (maintenances) => {
            const scheduled = maintenances.filter(m =>
              m.state === 'PENDING' || m.state === 'IN_PROGRESS'
            );
            const completed = maintenances.filter(m =>
              m.state === 'COMPLETED' || m.state === 'CANCELLED'
            );

            this.scheduledMaintenances.set(scheduled);
            this.completedMaintenances.set(completed);
          },
          error: (error) => {
            console.error('Error loading maintenances:', error);
            // Fallback to mock data on error
            this.loadMockMaintenances();
          }
        });
      },
      error: (error) => {
        console.error('Error getting mechanic ID:', error);
        // Fallback to mock data on error
        this.loadMockMaintenances();
      }
    });
  }

  private loadMockMaintenances(): void {
    const scheduled = this.mockMaintenances.filter(m =>
      m.state === 'PENDING' || m.state === 'IN_PROGRESS'
    );
    const completed = this.mockMaintenances.filter(m =>
      m.state === 'COMPLETED' || m.state === 'CANCELLED'
    );

    this.scheduledMaintenances.set(scheduled);
    this.completedMaintenances.set(completed);
  }

  saveMaintenanceState(maintenance: Maintenance): void {
    console.log('Saving maintenance state:', maintenance);

    if (maintenance.state === 'COMPLETED') {
      this.handleCompletedState(maintenance);
    } else if (maintenance.state === 'IN_PROGRESS' || maintenance.state === 'CANCELLED') {
      this.updateMaintenanceState(maintenance);
    }
  }

  private handleCompletedState(maintenance: Maintenance): void {
    const dialogRef = this.dialog.open(CreateExpenseDialogComponent, {
      width: 'auto',
      maxWidth: 'none',
      disableClose: false,
      panelClass: 'custom-expense-dialog'
    });

    dialogRef.afterClosed().subscribe((expenseData: any) => {
      if (expenseData) {
        this.createExpenseForMaintenance(maintenance, expenseData);
      } else {
        this.revertMaintenanceState(maintenance);
      }
    });
  }

  private createExpenseForMaintenance(maintenance: Maintenance, expenseData: any): void {
    console.log('Expense data received:', expenseData);

    this.userService.getOwnerId().subscribe({
      next: (ownerResponse) => {
        const ownerId = ownerResponse.ownerId;
        this.createAndAssignExpense(maintenance, ownerId, expenseData);
      },
      error: (error) => {
        console.error('Error getting owner ID:', error);
        alert('Failed to get owner information');
        this.revertMaintenanceState(maintenance);
      }
    });
  }

  private createAndAssignExpense(maintenance: Maintenance, ownerId: number, expenseData: any): void {
    this.expenseService.createExpense(ownerId, expenseData).subscribe({
      next: (createdExpense) => {
        console.log('Expense created successfully:', createdExpense);
        this.assignExpenseAndComplete(maintenance, createdExpense.id);
      },
      error: (error) => {
        console.error('Error creating expense:', error);
        alert('Failed to create expense');
        this.revertMaintenanceState(maintenance);
      }
    });
  }

  private assignExpenseAndComplete(maintenance: Maintenance, expenseId: number): void {
    this.maintenanceService.assignExpenseToMaintenance(maintenance.id, expenseId).subscribe({
      next: (updatedMaintenance) => {
        console.log('Expense assigned to maintenance:', updatedMaintenance);
        this.completeMaintenanceStatus(maintenance);
      },
      error: (error) => {
        console.error('Error assigning expense to maintenance:', error);
        alert('Failed to assign expense to maintenance');
      }
    });
  }

  private completeMaintenanceStatus(maintenance: Maintenance): void {
    this.maintenanceService.updateMaintenanceStatus(maintenance.id, 'COMPLETED').subscribe({
      next: (finalMaintenance) => {
        console.log('Maintenance status updated to COMPLETED:', finalMaintenance);
        this.loadMaintenances();
      },
      error: (error) => {
        console.error('Error updating maintenance status:', error);
        alert('Failed to update maintenance status');
      }
    });
  }

  private updateMaintenanceState(maintenance: Maintenance): void {
    this.maintenanceService.updateMaintenanceStatus(maintenance.id, maintenance.state).subscribe({
      next: (updatedMaintenance) => {
        console.log('Maintenance status updated:', updatedMaintenance);

        if (maintenance.state === 'CANCELLED') {
          this.loadMaintenances();
        }
      },
      error: (error) => {
        console.error('Error updating maintenance status:', error);
        alert('Failed to update maintenance status');
        this.loadMaintenances();
      }
    });
  }

  private revertMaintenanceState(maintenance: Maintenance): void {
    maintenance.state = 'IN_PROGRESS';
  }

  navigateToExpenseDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }
}
