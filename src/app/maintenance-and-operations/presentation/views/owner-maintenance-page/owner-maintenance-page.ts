import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';

interface MaintenanceCard {
  maintenance: Maintenance;
  vehicle?: Vehicle;
  mechanicName?: string;
}

@Component({
  selector: 'app-owner-maintenance-page',
  imports: [CommonModule],
  template: `
    <div class="screen p-10 relative">
      <!-- Loading State -->
      @if (maintenanceStore.loading() || vehiclesStore.loading()) {
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

      <!-- Scheduled Maintenances Section -->
      <h1 class="text-3xl font-bold mb-4">Scheduled Maintenances</h1>
      <div class="flex flex-col gap-4 mb-8">
        @if (scheduledCards().length === 0 && !maintenanceStore.loading()) {
          <p class="text-gray-500">No scheduled maintenances</p>
        }
        @for (card of scheduledCards(); track card.maintenance.id) {
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
                  <p>{{card.mechanicName || 'Loading...'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Vehicle:</p>
                  <p>{{getVehicleDisplay(card.vehicle)}}</p>
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
        @if (completedCards().length === 0 && !maintenanceStore.loading()) {
          <p class="text-gray-500">No completed maintenances</p>
        }
        @for (card of completedCards(); track card.maintenance.id) {
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
                  <p>{{card.mechanicName || 'Loading...'}}</p>
                </div>
                <div>
                  <p class="font-semibold">Vehicle:</p>
                  <p>{{getVehicleDisplay(card.vehicle)}}</p>
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
export class OwnerMaintenancePage implements OnInit {
  readonly maintenanceStore = inject(MaintenanceStore);
  readonly vehiclesStore = inject(VehiclesStore);
  readonly router = inject(Router);
  readonly http = inject(HttpClient);

  private mechanicNamesCache = signal<Map<number, string>>(new Map());

  // Computed signals for maintenance cards with enriched data
  readonly scheduledCards = computed<MaintenanceCard[]>(() => {
    const scheduled = this.maintenanceStore.scheduledMaintenances();
    return this.enrichMaintenances(scheduled);
  });

  readonly completedCards = computed<MaintenanceCard[]>(() => {
    const completed = this.maintenanceStore.completedMaintenances();
    return this.enrichMaintenances(completed);
  });

  constructor() {
    // Effect to load mechanic names when maintenances change
    effect(() => {
      const maintenances = this.maintenanceStore.maintenances();
      maintenances.forEach(maintenance => {
        if (!this.mechanicNamesCache().has(maintenance.mechanicId)) {
          this.loadMechanicName(maintenance.mechanicId);
        }
      });
    });
  }

  ngOnInit(): void {
    this.loadMaintenances();
  }

  private loadMaintenances(): void {
    const roleId = localStorage.getItem('role_id');
    if (!roleId) {
      console.error('Owner ID not found');
      return;
    }

    const ownerId = parseInt(roleId, 10);

    // Load vehicles for this owner, then load maintenances for each vehicle
    const vehicles = this.vehiclesStore.vehicles();

    if (vehicles.length === 0) {
      // If vehicles aren't loaded yet, load them first
      this.vehiclesStore.loadVehiclesByOwner(ownerId);

      // Wait a bit and then load maintenances
      setTimeout(() => {
        this.loadMaintenancesForVehicles();
      }, 500);
    } else {
      this.loadMaintenancesForVehicles();
    }
  }

  private loadMaintenancesForVehicles(): void {
    const vehicles = this.vehiclesStore.vehicles();

    // For now, load maintenances by each vehicle ID
    // In a production app, you might want a single endpoint to get all maintenances for an owner
    vehicles.forEach(vehicle => {
      this.maintenanceStore.loadMaintenancesByVehicleId(vehicle.id);
    });
  }

  private enrichMaintenances(maintenances: Maintenance[]): MaintenanceCard[] {
    return maintenances.map(maintenance => {
      const vehicle = this.vehiclesStore.vehicles().find(v => v.id === maintenance.vehicleId);
      const mechanicName = this.mechanicNamesCache().get(maintenance.mechanicId);

      return {
        maintenance,
        vehicle,
        mechanicName
      };
    });
  }

  private loadMechanicName(mechanicId: number): void {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<{id: number, username: string}>(`${baseUrl}/users/${mechanicId}`, { headers })
      .subscribe({
        next: (user) => {
          this.mechanicNamesCache.update(cache => {
            const newCache = new Map(cache);
            newCache.set(mechanicId, user.username);
            return newCache;
          });
        },
        error: (error) => {
          console.error(`Error loading mechanic ${mechanicId}:`, error);
          this.mechanicNamesCache.update(cache => {
            const newCache = new Map(cache);
            newCache.set(mechanicId, 'Unknown Mechanic');
            return newCache;
          });
        }
      });
  }

  navigateToExpenseDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }

  getVehicleDisplay(vehicle?: Vehicle): string {
    if (!vehicle) {
      return 'Loading...';
    }
    if (!vehicle.model) {
      return vehicle.plate || 'Unknown Vehicle';
    }
    return `${vehicle.model.brand} ${vehicle.model.name} - ${vehicle.plate}`;
  }
}
