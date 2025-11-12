import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';

@Component({
  selector: 'app-create-maintenance-page',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="screen p-10 relative">
      <h1 class="text-3xl font-bold mb-6">Create Maintenance</h1>

      <!-- Loading State -->
      @if (maintenanceStore.loading() || assignmentsStore.loading()) {
        <div class="text-center text-gray-500 py-8">
          Loading...
        </div>
      }

      <!-- Error State -->
      @if (maintenanceStore.error()) {
        <div class="text-center text-red-500 py-8 mb-4">
          {{maintenanceStore.error()}}
        </div>
      }

      <div class="bg-[#380800] rounded-2xl p-6">
        <form (ngSubmit)="onSubmit()" #maintenanceForm="ngForm" class="space-y-4">
          <!-- Details -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Details</mat-label>
            <input matInput [(ngModel)]="formData.details" class="bg-white text-black" name="details" required>
          </mat-form-field>

          <!-- Date of Service -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Date of Service</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="formData.dateOfService" name="dateOfService" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <!-- Hour of Service -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Hour of Service</mat-label>
            <input matInput type="time" [(ngModel)]="formData.hourOfService" name="hourOfService" required>
          </mat-form-field>

          <!-- Location -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Location</mat-label>
            <input matInput [(ngModel)]="formData.location" name="location" required>
          </mat-form-field>

          <!-- Description -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="formData.description" name="description" rows="3" required></textarea>
          </mat-form-field>

          <!-- Owner Selector -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Select Owner</mat-label>
            <mat-select [(ngModel)]="selectedOwnerId" name="owner" (selectionChange)="onOwnerChange()" required>
              @for (assignment of activeAssignments(); track assignment.id) {
                @if (assignment.owner) {
                  <mat-option [value]="assignment.owner.id">
                    {{ assignment.owner.completeName }}
                  </mat-option>
                }
              }
            </mat-select>
          </mat-form-field>

          <!-- Vehicle Selector -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Select Vehicle</mat-label>
            <mat-select [(ngModel)]="formData.vehicleId" name="vehicle" [disabled]="!selectedOwnerId" required>
              @for (vehicle of ownerVehicles(); track vehicle.id) {
                <mat-option [value]="vehicle.id">
                  {{getVehicleDisplay(vehicle)}}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <!-- Buttons -->
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" (click)="goBack()" class="bg-white text-black px-6 py-2 rounded-lg">
              Go Back
            </button>
            <button type="submit"
                    [disabled]="!maintenanceForm.form.valid || isSubmitting() || maintenanceStore.loading()"
                    class="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting() ? 'Creating...' : 'Create Maintenance' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``
})
export class CreateMaintenancePage implements OnInit {
  readonly maintenanceStore = inject(MaintenanceStore);
  readonly assignmentsStore = inject(AssignmentsStore);
  readonly router = inject(Router);
  readonly http = inject(HttpClient);

  mechanicId = signal<number>(0);
  selectedOwnerId = signal<number | null>(null);
  isSubmitting = signal(false);
  ownerVehicles = signal<Vehicle[]>([]);

  // Computed signal for active assignments
  readonly activeAssignments = computed(() => this.assignmentsStore.activeAssignments());

  formData = {
    details: '',
    dateOfService: null as Date | null,
    hourOfService: '',
    location: '',
    description: '',
    vehicleId: null as number | null
  };

  constructor() {
    // Effect to automatically navigate on successful creation
    effect(() => {
      if (!this.maintenanceStore.loading() &&
          this.isSubmitting() &&
          !this.maintenanceStore.error() &&
          this.maintenanceStore.maintenances().length > 0) {
        // Navigate after successful creation
        setTimeout(() => {
          this.router.navigate(['/maintenances/mechanic']);
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    this.loadMechanicData();
  }

  private loadMechanicData(): void {
    const roleId = localStorage.getItem('role_id');
    if (!roleId) {
      console.error('Mechanic ID not found');
      return;
    }

    const mechanicId = parseInt(roleId, 10);
    this.mechanicId.set(mechanicId);

    // Load active assignments via HTTP (since store method might not exist yet)
    this.loadAssignments(mechanicId);
  }

  private loadAssignments(mechanicId: number): void {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    this.http.get<any[]>(`${baseUrl}/mechanic/${mechanicId}/assignments/ACTIVE`, { headers })
      .subscribe({
        next: (assignments) => {
          // Store assignments in the assignments store if needed
          console.log('Active assignments loaded:', assignments);
        },
        error: (error) => {
          console.error('Error loading assignments:', error);
        }
      });
  }

  onOwnerChange(): void {
    const ownerId = this.selectedOwnerId();
    if (ownerId) {
      // Load vehicles for the selected owner
      const baseUrl = environment.platformProviderApiBaseUrl;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });

      this.http.get<Vehicle[]>(`${baseUrl}/vehicles/owner/${ownerId}`, { headers })
        .subscribe({
          next: (vehicles) => {
            this.ownerVehicles.set(vehicles);
            this.formData.vehicleId = null; // Reset vehicle selection
          },
          error: (error) => {
            console.error('Error loading vehicles:', error);
            this.ownerVehicles.set([]);
          }
        });
    } else {
      this.ownerVehicles.set([]);
      this.formData.vehicleId = null;
    }
  }

  onSubmit(): void {
    if (!this.formData.dateOfService || !this.formData.hourOfService || !this.formData.vehicleId) {
      return;
    }

    this.isSubmitting.set(true);

    // Combine date and time into ISO string
    const date = new Date(this.formData.dateOfService);
    const [hours, minutes] = this.formData.hourOfService.split(':');
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    const dateOfService = date.toISOString();

    const maintenanceData = {
      details: this.formData.details,
      vehicleId: this.formData.vehicleId,
      dateOfService: dateOfService,
      location: this.formData.location,
      description: this.formData.description,
      mechanicId: this.mechanicId()
    };

    // Use the store to create maintenance
    this.maintenanceStore.createMaintenance(maintenanceData as any);

    // Check for errors after a short delay
    setTimeout(() => {
      if (this.maintenanceStore.error()) {
        this.isSubmitting.set(false);
      }
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/maintenances/mechanic']);
  }

  getVehicleDisplay(vehicle: Vehicle): string {
    if (!vehicle.model) {
      return vehicle.plate || 'Unknown Vehicle';
    }
    return `${vehicle.model.brand} ${vehicle.model.name} - ${vehicle.plate}`;
  }
}
