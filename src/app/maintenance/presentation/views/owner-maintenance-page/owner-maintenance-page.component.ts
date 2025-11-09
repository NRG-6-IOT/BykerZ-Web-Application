import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Maintenance} from '@app/maintenance/domain/model/maintenance.entity';
import {MaintenanceService} from '@app/maintenance/infrastructure/maintenance.service';
import {VehicleService} from '@app/vehiclemanagement/services/vehicle.service';
import {UserService} from '@app/iam/services/user.service';
import {Vehicle} from '@app/vehiclemanagement/model/vehicle.entity';
import {User} from '@app/iam/model/user.entity';

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
                  <p>{{card.maintenance.dateOfService}}</p>
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
                  <p>{{card.maintenance.dateOfService}}</p>
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

  // Mock data for testing
  private mockMaintenances: Maintenance[] = [
    {
      id: 1,
      details: "Regular oil change and filter replacement",
      vehicleId: 1,
      dateOfService: "2025-11-15 10:00 AM",
      location: "Talambo 135, San Miguel 15087",
      description: "Scheduled maintenance",
      state: "PENDING",
      expense: null
    },
    {
      id: 2,
      details: "Brake inspection and tire rotation",
      vehicleId: 1,
      dateOfService: "2025-11-10 02:00 PM",
      location: "Av. Universitaria 456, Los Olivos 15304",
      description: "Preventive maintenance",
      state: "IN_PROGRESS",
      expense: null
    },
    {
      id: 3,
      details: "Complete engine overhaul",
      vehicleId: 1,
      dateOfService: "2025-10-20 09:00 AM",
      location: "Talambo 135, San Miguel 15087",
      description: "Major repair work",
      state: "COMPLETED",
      expense: {
        id: 1,
        name: "Engine Overhaul Expense",
        finalPrice: 1500.00,
        expenseType: "MAINTENANCE",
        items: [
          {
            id: 1,
            name: "Engine parts",
            amount: 10,
            unitPrice: 100,
            totalPrice: 1000,
            itemType: "SUPPLIES"
          },
          {
            id: 2,
            name: "Labor",
            amount: 5,
            unitPrice: 100,
            totalPrice: 500,
            itemType: "PAYMENT"
          }
        ]
      }
    }
  ];

  constructor(
    private maintenanceService: MaintenanceService,
    private vehicleService: VehicleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    // Using mock data for now
    // TODO: Replace with actual API call when backend is ready
    // this.maintenanceService.getMaintenances().subscribe({
    //   next: (maintenances) => {
    //     this.processMaintenances(maintenances);
    //   },
    //   error: (error) => {
    //     console.error('Error loading maintenances:', error);
    //   }
    // });

    // Using mock data
    this.processMaintenances(this.mockMaintenances);
  }

  processMaintenances(maintenances: Maintenance[]): void {
    // Separate scheduled and completed maintenances
    const scheduled = maintenances.filter(m =>
      m.state === 'PENDING' || m.state === 'IN_PROGRESS'
    );
    const completed = maintenances.filter(m =>
      m.state === 'COMPLETED' || m.state === 'CANCELLED'
    );

    // Load vehicle and mechanic data for scheduled maintenances
    scheduled.forEach(maintenance => {
      const card: MaintenanceCard = { maintenance };
      this.scheduledMaintenances.push(card);
      this.loadAdditionalData(card);
    });

    // Load vehicle and mechanic data for completed maintenances
    completed.forEach(maintenance => {
      const card: MaintenanceCard = { maintenance };
      this.completedMaintenances.push(card);
      this.loadAdditionalData(card);
    });
  }

  loadAdditionalData(card: MaintenanceCard): void {
    // Load vehicle data
    this.vehicleService.getVehicleById(card.maintenance.vehicleId).subscribe({
      next: (vehicle) => {
        card.vehicle = vehicle;
        // Load mechanic data using the mechanicId from the vehicle
        if (vehicle.mechanicId) {
          this.userService.getUserById(vehicle.mechanicId).subscribe({
            next: (mechanic: User) => {
              card.mechanic = mechanic;
            },
            error: (error: any) => {
              console.error('Error loading mechanic:', error);
              // Set a fallback mechanic name
              card.mechanic = { id: vehicle.mechanicId, username: 'Unknown Mechanic' };
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading vehicle:', error);
      }
    });
  }
}
