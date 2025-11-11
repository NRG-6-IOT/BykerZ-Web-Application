import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Maintenance} from '@app/maintenance/domain/model/maintenance.entity';
import {MaintenanceService} from '@app/maintenance/infrastructure/maintenance.service';
import {VehicleService} from '@app/vehiclemanagement/services/vehicle.service';
import {UserService} from '@app/iam/services/user.service';
import {Vehicle} from '@app/vehiclemanagement/model/vehicle.entity';
import {User} from '@app/iam/model/user.entity';
import {forkJoin, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {TokenService} from "@app/shared/infrastructure/token.service";
import {AuthenticationService} from '@app/iam/services/authentication.service';

interface MaintenanceCard {
  maintenance: Maintenance;
  vehicle?: Vehicle;
  mechanic?: User;
}

@Component({
  selector: 'app-owner-maintenance-page',
  imports: [CommonModule],
  template: `
    <div class="w-full h-full p-10 relative">
      <!-- Scheduled Maintenances Section -->
      <h1 class="text-3xl font-bold mb-4">Scheduled Maintenances</h1>
      <div class="flex flex-col gap-4 mb-8">
        @if (scheduledMaintenances.length === 0) {
          <p class="text-gray-500">No scheduled maintenances</p>
        }
        @for (card of scheduledMaintenances; track card.maintenance.id) {
          <div class="bg-[#FF6B35] rounded-2xl p-2">
            <div class="bg-white text-black rounded-xl p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="font-semibold">Date & Time:</p>
                  <p>{{card.maintenance.dateOfService | date:'medium'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Location:</p>
                  <p>{{card.maintenance.location}}</p>
                </div>
                <div>
                  <p class="font-semibold">Mechanic:</p>
                  <p>{{card.mechanic?.username || 'Loading...'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Vehicle:</p>
                  <p>{{card.vehicle ? (card.vehicle.model.brand + ' ' + card.vehicle.model.name + ' - ' + card.vehicle.plate) : 'Loading...'}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Details:</p>
                  <p>{{card.maintenance.details}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Status:</p>
                  <p class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                     [ngClass]="{
                       'bg-yellow-200 text-yellow-800': card.maintenance.state === 'PENDING',
                       'bg-blue-200 text-blue-800': card.maintenance.state === 'IN_PROGRESS'
                     }">
                    {{card.maintenance.state}}
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Completed Maintenances Section -->
      <h1 class="text-3xl font-bold mb-4">Maintenances Done</h1>
      <div class="flex flex-col gap-4 mb-4">
        @if (completedMaintenances.length === 0) {
          <p class="text-gray-500">No completed maintenances</p>
        }
        @for (card of completedMaintenances; track card.maintenance.id) {
          <div class="bg-[#FF6B35] rounded-2xl p-2">
            <div class="bg-white text-black rounded-xl p-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="font-semibold">Date & Time:</p>
                  <p>{{card.maintenance.dateOfService | date:'medium'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Location:</p>
                  <p>{{card.maintenance.location}}</p>
                </div>
                <div>
                  <p class="font-semibold">Mechanic:</p>
                  <p>{{card.mechanic?.username || 'Loading...'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Vehicle:</p>
                  <p>{{card.vehicle ? (card.vehicle.model.brand + ' ' + card.vehicle.model.name + ' - ' + card.vehicle.plate) : 'Loading...'}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Details:</p>
                  <p>{{card.maintenance.details}}</p>
                </div>
                <div class="col-span-2">
                  <p class="font-semibold">Status:</p>
                  <p class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
                     [ngClass]="{
                       'bg-green-200 text-green-800': card.maintenance.state === 'COMPLETED',
                       'bg-red-200 text-red-800': card.maintenance.state === 'CANCELLED'
                     }">
                    {{card.maintenance.state}}
                  </p>
                </div>
                @if (card.maintenance.expense) {
                  <div class="col-span-2">
                    <p class="font-semibold">Expense:</p>
                    <p>{{card.maintenance.expense.name}} - $ {{card.maintenance.expense.finalPrice | number:'1.2-2'}}</p>
                  </div>
                  <div class="col-span-2">
                    <button
                      (click)="navigateToExpenseDetails(card.maintenance.expense.id)"
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
export class OwnerMaintenancePageComponent implements OnInit {
  scheduledMaintenances: MaintenanceCard[] = [];
  completedMaintenances: MaintenanceCard[] = [];
  private userId: number | null = null;

  constructor(
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService,
    private userService: UserService,
    private tokenService: TokenService,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getOwnerId().subscribe( ({ownerId}) => {
      this.userId = ownerId;
      console.log('User ID:', this.userId);

      if (this.userId) {
        this.loadMaintenancesForOwner(this.userId);
      } else {
        console.error('User ID not found');
      }
    })

  }

  loadMaintenancesForOwner(ownerId: number): void {
    this.vehicleService.getVehiclesByOwnerId(ownerId).pipe(
      switchMap(vehicles => {
        if (vehicles.length === 0) {
          return of([]);
        }
        const maintenanceRequests = vehicles.map(vehicle =>
          this.maintenanceService.getMaintenancesByVehicleId(vehicle.id).pipe(
            catchError(error => {
              console.error(`Error loading maintenances for vehicle ${vehicle.id}:`, error);
              return of([]); // Return an empty array on error to not break the forkJoin
            })
          )
        );
        return forkJoin(maintenanceRequests);
      }),
      switchMap(maintenancesArray => {
        // Flatten the array of arrays into a single array of maintenances
        const allMaintenances = maintenancesArray.flat();
        return of(allMaintenances);
      })
    ).subscribe({
      next: (maintenances) => {
        this.processMaintenances(maintenances);
      },
      error: (error) => {
        console.error('Error loading vehicles or maintenances:', error);
      }
    });
  }


  processMaintenances(maintenances: Maintenance[]): void {
    const scheduled = maintenances.filter(m =>
      m.state === 'PENDING' || m.state === 'IN_PROGRESS'
    );
    const completed = maintenances.filter(m =>
      m.state === 'COMPLETED' || m.state === 'CANCELLED'
    );

    scheduled.forEach(maintenance => {
      const card: MaintenanceCard = { maintenance };
      this.scheduledMaintenances.push(card);
      this.loadAdditionalData(card);
    });

    completed.forEach(maintenance => {
      const card: MaintenanceCard = { maintenance };
      this.completedMaintenances.push(card);
      this.loadAdditionalData(card);
    });
  }

  loadAdditionalData(card: MaintenanceCard): void {
    const vehicleRequest = this.vehicleService.getVehicleById(card.maintenance.vehicleId).pipe(
      catchError(error => {
        console.error('Error loading vehicle:', error);
        return of(undefined);
      })
    );

    const mechanicRequest = this.userService.getUserById(card.maintenance.mechanicId).pipe(
      catchError(error => {
        console.error('Error loading mechanic:', error);
        return of({ id: card.maintenance.mechanicId, username: 'Unknown Mechanic' } as User);
      })
    );

    forkJoin({
      vehicle: vehicleRequest,
      mechanic: mechanicRequest
    }).subscribe(({ vehicle, mechanic }) => {
      card.vehicle = vehicle;
      card.mechanic = mechanic;
    });
  }

  navigateToExpenseDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }
}
