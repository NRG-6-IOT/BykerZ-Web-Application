import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MaintenanceService } from '../../../infrastructure/maintenance.service';
import { UserService } from '../../../../iam/services/user.service';
import { AssignmentService } from '../../../infrastructure/assignment.service';
import { VehicleService } from '../../../../vehiclemanagement/services/vehicle.service';
import { Vehicle } from '../../../../vehiclemanagement/model/vehicle.entity';

interface Assignment {
  id: number;
  owner: {
    ownerId: number;
    completeName: string;
  };
  mechanic: {
    mechanicId: number;
    completeName: string;
  };
  type: string;
  status: string;
  assignmentCode: string;
  createdAt: string;
}

@Component({
  selector: 'app-create-maintenance-page',
  standalone: true,
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
    <div class="w-full h-full p-10 relative">
      <h1 class="text-3xl font-bold mb-6 ">Create Maintenance</h1>

      <div class="bg-[#380800] rounded-2xl p-6">
        <form (ngSubmit)="onSubmit()" #maintenanceForm="ngForm" class="space-y-4">
          <!-- Details -->
          <mat-form-field appearance="fill" class="w-full ">
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
              <mat-option *ngFor="let assignment of assignments()" [value]="assignment.owner.ownerId">
                {{ assignment.owner.completeName }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Vehicle Selector -->
          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Select Vehicle</mat-label>
            <mat-select [(ngModel)]="formData.vehicleId" name="vehicle" [disabled]="!selectedOwnerId" required>
              <mat-option *ngFor="let vehicle of vehicles()" [value]="vehicle.id">
                {{ vehicle.model.brand }} {{ vehicle.model.name }} - {{ vehicle.plate }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Buttons -->
          <div class="flex gap-4 justify-end mt-6">
            <button type="button"  (click)="goBack()" class="bg-white text-black px-6 py-2 rounded-lg">
              Go Back
            </button>
            <button type="submit"  [disabled]="!maintenanceForm.form.valid || isSubmitting()"
                    class="bg-[#FF6B35] text-white px-6 py-2 rounded-lg hover:bg-[#ff9169] transition-colors font-semibold">
              {{ isSubmitting() ? 'Creating...' : 'Create Maintenance' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `

  `
})
export class CreateMaintenancePageComponent implements OnInit {
  mechanicId: number = 0;
  selectedOwnerId: number | null = null;

  assignments = signal<Assignment[]>([]);
  vehicles = signal<Vehicle[]>([]);
  isSubmitting = signal(false);

  formData = {
    details: '',
    dateOfService: null as Date | null,
    hourOfService: '',
    location: '',
    description: '',
    vehicleId: null as number | null
  };

  constructor(
    private maintenanceService: MaintenanceService,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMechanicData();
  }

  loadMechanicData(): void {
    this.userService.getMechanicId().subscribe({
      next: (response) => {
        this.mechanicId = response.mechanicId;
        this.loadAssignments();
      },
      error: (error) => {
        console.error('Error getting mechanic ID:', error);
      }
    });
  }

  loadAssignments(): void {
    this.assignmentService.getAssignmentsByMechanicIdAndStatus(this.mechanicId, 'ACTIVE').subscribe({
      next: (assignments) => {
        this.assignments.set(assignments);
      },
      error: (error) => {
        console.error('Error loading assignments:', error);
      }
    });
  }

  onOwnerChange(): void {
    if (this.selectedOwnerId) {
      this.vehicleService.getVehiclesByOwnerId(this.selectedOwnerId).subscribe({
        next: (vehicles) => {
          this.vehicles.set(vehicles);
          this.formData.vehicleId = null; // Reset vehicle selection
        },
        error: (error) => {
          console.error('Error loading vehicles:', error);
          this.vehicles.set([]);
        }
      });
    } else {
      this.vehicles.set([]);
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
      mechanicId: this.mechanicId
    };

    this.maintenanceService.createMaintenance(maintenanceData).subscribe({
      next: (response) => {
        console.log('Maintenance created successfully:', response);
        this.router.navigate(['/mechanic/maintenance']);
      },
      error: (error) => {
        console.error('Error creating maintenance:', error);
        alert('Failed to create maintenance. Please try again.');
        this.isSubmitting.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/mechanic/maintenance']);
  }
}
