import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, NgForm} from '@angular/forms';
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
import {Assignment} from '@app/assignments/domain/model/assignment.entity';

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
        <form (ngSubmit)="onSubmit(maintenanceForm)" #maintenanceForm="ngForm" class="space-y-4">
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
            <mat-select [(ngModel)]="selectedOwnerIdValue" (ngModelChange)="onOwnerChange($event)" name="owner" required>
              <mat-option *ngFor="let assignment of getValidAssignments()" [value]="assignment.owner?.id">
                {{ assignment.owner?.completeName }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Vehicle Selector -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Select Vehicle</mat-label>
            <mat-select [(ngModel)]="formData.vehicleId" name="vehicle" [disabled]="!selectedOwnerIdValue" required>
              <mat-option *ngFor="let vehicle of ownerVehicles" [value]="vehicle.id">
                {{getVehicleDisplay(vehicle)}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Buttons -->
          <div class="flex gap-4 justify-end mt-6">
            <button type="button" (click)="goBack()" class="bg-white text-black px-6 py-2 rounded-lg">
              Go Back
            </button>
            <button type="submit"
                    [disabled]="!maintenanceForm.form.valid || isSubmitting || maintenanceStore.loading()"
                    class="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Creating...' : 'Create Maintenance' }}
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

  mechanicId = 0;
  selectedOwnerIdValue: number | null = null;
  isSubmitting = false;
  ownerVehicles: Vehicle[] = [];
  activeAssignments: Assignment[] = [];

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
          this.isSubmitting &&
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
    this.mechanicId = mechanicId;
    console.log('Loaded mechanic ID:', mechanicId);

    // Load active assignments via HTTP
    this.loadAssignments(mechanicId);
  }

  private loadAssignments(mechanicId: number): void {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });

    console.log('Loading assignments for mechanic:', mechanicId);

    this.http.get<any[]>(`${baseUrl}/mechanic/${mechanicId}/assignments/ACTIVE`, { headers })
      .subscribe({
        next: (assignments) => {
          console.log('Raw assignments from API:', assignments);

          // Map raw API data to Assignment entities and store locally for the selector
          const mapped = (assignments || []).map(a => {
            console.log('Mapping assignment:', a);
            return new Assignment(a);
          });

          this.activeAssignments = mapped;
          console.log('Mapped assignments:', this.activeAssignments);

          // Log owner information for debugging
          this.activeAssignments.forEach((assignment, index) => {
            console.log(`Assignment ${index}:`, {
              id: assignment.id,
              owner: assignment.owner,
              ownerId: assignment.owner?.id,
              ownerName: assignment.owner?.completeName
            });
          });
        },
        error: (error) => {
          console.error('Error loading assignments:', error);
          this.activeAssignments = [];
        }
      });
  }

  onOwnerChange(ownerId: number | string | null): void {
    console.log('Owner change triggered with value:', ownerId, 'type:', typeof ownerId);

    const parsedId = ownerId ? Number(ownerId) : null;

    console.log('Parsed owner ID:', parsedId);

    this.selectedOwnerIdValue = parsedId;

    if (parsedId !== null && !isNaN(parsedId)) {
      console.log('Loading vehicles for owner ID:', parsedId);

      // Load vehicles for the selected owner
      const baseUrl = environment.platformProviderApiBaseUrl;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });

      this.http.get<Vehicle[]>(`${baseUrl}/vehicles/owner/${parsedId}`, { headers })
        .subscribe({
          next: (vehicles) => {
            console.log('Loaded vehicles:', vehicles);
            this.ownerVehicles = vehicles;
            this.formData.vehicleId = null; // Reset vehicle selection
          },
          error: (error) => {
            console.error('Error loading vehicles:', error);
            this.ownerVehicles = [];
          }
        });
    } else {
      console.log('No valid owner ID, clearing vehicles');
      this.ownerVehicles = [];
      this.formData.vehicleId = null;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.formData.dateOfService || !this.formData.hourOfService || !this.formData.vehicleId) {
      this.logFormErrors(form);
      return;
    }

    this.isSubmitting = true;

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
      mechanicId: this.mechanicId
    };

    // Use the store to create maintenance
    this.maintenanceStore.createMaintenance(maintenanceData as any);

    // Check for errors after a short delay
    setTimeout(() => {
      if (this.maintenanceStore.error()) {
        this.isSubmitting = false;
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

  private logFormErrors(form: NgForm): void {
    if (!form || !form.controls) {
      console.error('Form reference missing or invalid.');
      return;
    }

    Object.entries(form.controls).forEach(([controlName, control]) => {
      if (control.invalid) {
        console.error(`Validation error in "${controlName}":`, control.errors);
      }
    });

    if (!this.formData.dateOfService) {
      console.error('Validation error: dateOfService is required.');
    }
    if (!this.formData.hourOfService) {
      console.error('Validation error: hourOfService is required.');
    }
    if (!this.formData.vehicleId) {
      console.error('Validation error: vehicleId is required.');
    }
  }

  getValidAssignments(): Assignment[] {
    return this.activeAssignments.filter(assignment => assignment.owner && assignment.owner.id);
  }
}
