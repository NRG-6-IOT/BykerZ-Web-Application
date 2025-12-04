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
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-create-maintenance-page',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    TranslateModule
  ],
  template: `
    <div class="page">
      <div class="form-card">
        <div class="card-header">
          <h1 class="card-title">{{ 'maintenance.create.title' | translate }}</h1>
          <p class="card-subtitle">{{ 'maintenance.create.subtitle' | translate }}</p>
        </div>

        <form (ngSubmit)="onSubmit(maintenanceForm)" #maintenanceForm="ngForm" class="card-body">

          <div class="form-section">
            <h3 class="section-label">{{ 'maintenance.create.vehicleInfo' | translate }}</h3>

            <div class="grid-2">
              <div class="input-group">
                <label class="input-label">{{ 'maintenance.create.owner' | translate }}</label>
                <mat-form-field appearance="outline" class="custom-field">
                  <mat-label>{{ 'maintenance.create.selectOwner' | translate }}</mat-label>
                  <mat-select [(ngModel)]="selectedOwnerIdValue" (ngModelChange)="onOwnerChange($event)" name="owner" required>
                    <mat-option *ngFor="let assignment of getValidAssignments()" [value]="assignment.owner?.id">
                      {{ assignment.owner?.completeName }}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="input-group">
                <label class="input-label">{{ 'maintenance.create.vehicle' | translate }}</label>
                <mat-form-field appearance="outline" class="custom-field">
                  <mat-label>{{ 'maintenance.create.selectVehicle' | translate }}</mat-label>
                  <mat-select [(ngModel)]="formData.vehicleId" name="vehicle" [disabled]="!selectedOwnerIdValue" required>
                    <mat-option *ngFor="let vehicle of ownerVehicles" [value]="vehicle.id">
                      {{getVehicleDisplay(vehicle)}}
                    </mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3 class="section-label">{{ 'maintenance.create.serviceDetails' | translate }}</h3>

            <div class="input-group w-full">
              <label class="input-label">{{ 'maintenance.create.serviceTitle' | translate }}</label>
              <mat-form-field appearance="outline" class="custom-field w-full">
                <mat-label>{{ 'maintenance.create.titlePlaceholder' | translate }}</mat-label>
                <input matInput [(ngModel)]="formData.details" name="details" required
                       placeholder="Ex: Oil Change & Filter Replacement">
              </mat-form-field>
            </div>

            <div class="grid-2">
              <div class="input-group">
                <label class="input-label">{{ 'maintenance.create.serviceDate' | translate }}</label>
                <mat-form-field appearance="outline" class="custom-field">
                  <mat-label>{{ 'maintenance.create.date' | translate }}</mat-label>
                  <input matInput [matDatepicker]="picker" [(ngModel)]="formData.dateOfService" name="dateOfService" required
                         placeholder="MM/DD/YYYY">
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                </mat-form-field>
              </div>

              <div class="input-group">
                <label class="input-label">{{ 'maintenance.create.serviceTime' | translate }}</label>
                <mat-form-field appearance="outline" class="custom-field">
                  <mat-label>{{ 'maintenance.create.time' | translate }}</mat-label>
                  <input matInput type="time" [(ngModel)]="formData.hourOfService" name="hourOfService" required>
                </mat-form-field>
              </div>
            </div>

            <div class="input-group w-full">
              <label class="input-label">{{ 'maintenance.create.serviceLocation' | translate }}</label>
              <mat-form-field appearance="outline" class="custom-field w-full">
                <mat-label>{{ 'maintenance.create.location' | translate }}</mat-label>
                <input matInput [(ngModel)]="formData.location" name="location" required
                       placeholder="Ex: Main Workshop, Av. La Marina 200">
              </mat-form-field>
            </div>

            <div class="input-group w-full">
              <label class="input-label">{{ 'maintenance.create.serviceDescription' | translate }}</label>
              <mat-form-field appearance="outline" class="custom-field w-full">
                <mat-label>{{ 'maintenance.create.description' | translate }}</mat-label>
                <textarea matInput [(ngModel)]="formData.description" name="description" rows="4" required
                          placeholder="Detailed description of the service to be performed..."></textarea>
              </mat-form-field>
            </div>
          </div>

          <div class="actions">
            <button type="button" (click)="goBack()" class="btn-secondary">{{ 'common.cancel' | translate }}</button>
            <button type="submit"
                    [disabled]="!maintenanceForm.form.valid || isSubmitting || maintenanceStore.loading()"
                    class="btn-primary">
              {{ isSubmitting ? ('common.saving' | translate) : ('maintenance.create.submitButton' | translate) }}
            </button>
          </div>

          <div class="error-msg" *ngIf="maintenanceStore.error()">{{maintenanceStore.error()}}</div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page {
      display: flex; justify-content: center; align-items: flex-start; padding: 2rem;
      min-height: 100vh; background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }

    .form-card {
      width: 100%; max-width: 700px;
      background: white; border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); overflow: hidden;
      animation: fadeIn 0.5s ease-in;
      align-self: flex-start;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .card-header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 2rem 2rem; text-align: center; color: white;
    }

    .card-title {
      font-size: 1.75rem; font-weight: 800; margin: 0;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .card-subtitle { color: rgba(255,255,255,0.7); margin: 0.5rem 0 0; font-size: 1rem; }

    .card-body { padding: 2rem; }

    .form-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #f0f0f0;
    }
    .form-section:last-of-type {
      border-bottom: none;
    }

    .section-label {
      font-size: 0.85rem; text-transform: uppercase; color: #ff6b35;
      font-weight: 800; margin-bottom: 1.25rem; letter-spacing: 1px;
      border-bottom: 2px solid #fff5f0; padding-bottom: 0.4rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 1.25rem;
    }

    .input-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 0.4rem;
      letter-spacing: 0.3px;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .w-full { width: 100%; }

    /* --- ESTILOS DE INPUTS "CLEAN BOX" --- */
    ::ng-deep .custom-field .mdc-notched-outline,
    ::ng-deep .custom-field .mdc-notched-outline__leading,
    ::ng-deep .custom-field .mdc-notched-outline__notch,
    ::ng-deep .custom-field .mdc-notched-outline__trailing {
      display: none !important;
    }

    ::ng-deep .custom-field .mat-mdc-form-field-flex {
      background-color: #e8eaed !important;
      border-radius: 10px !important;
      padding: 0 14px !important;
      border: 1px solid #d1d5db;
      transition: all 0.2s ease;
      align-items: center;
    }

    ::ng-deep .custom-field:not(.mat-form-field-type-mat-input[rows]) .mat-mdc-form-field-flex {
      height: 48px;
    }

    ::ng-deep .custom-field:hover .mat-mdc-form-field-flex {
      background-color: #f3f4f6 !important;
      border-color: #9ca3af;
    }

    ::ng-deep .custom-field.mat-focused .mat-mdc-form-field-flex {
      border-color: #ff6b35 !important;
      background-color: #fff !important;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    ::ng-deep .custom-field input,
    ::ng-deep .custom-field textarea,
    ::ng-deep .custom-field .mat-mdc-select-value {
      color: #000000 !important;
      font-weight: 600;
      caret-color: #ff6b35;
    }

    ::ng-deep .custom-field .mat-mdc-floating-label {
      top: 50% !important; left: 14px !important;
      transform: translateY(-50%);
      color: #6b7280 !important; font-weight: 500;
      pointer-events: none;
    }

    ::ng-deep .custom-field.mat-form-field-should-float .mat-mdc-floating-label {
      transform: translateY(-24px) scale(0.82) !important;
      color: #ff6b35 !important;
      position: absolute;
      background: white !important;
      padding: 0 6px;
      margin-left: -6px;
      z-index: 10;
    }

    ::ng-deep .custom-field .mat-mdc-form-field-bottom-align::before { display: none !important; }

    /* Reducir tamaño del mat-form-field */
    ::ng-deep .custom-field.mat-mdc-form-field {
      --mat-mdc-form-field-floating-label-scale: 0.82;
      font-size: 0.9rem;
      line-height: 1.3;
    }

    ::ng-deep .custom-field .mat-mdc-text-field-wrapper {
      padding-bottom: 0 !important;
    }

    ::ng-deep .custom-field .mat-mdc-form-field-subscript-wrapper {
      display: none !important;
    }

    /* Estilos específicos para textarea */
    ::ng-deep .custom-field textarea {
      resize: vertical !important;
      min-height: 80px !important;
      max-height: 200px !important;
      overflow-y: auto !important;
      word-wrap: break-word !important;
      white-space: pre-wrap !important;
      line-height: 1.5 !important;
    }

    ::ng-deep .custom-field .mat-mdc-form-field-flex:has(textarea) {
      height: auto !important;
      min-height: 80px !important;
      padding: 12px 14px !important;
      align-items: flex-start !important;
    }

    ::ng-deep .mat-datepicker-toggle { color: #ff6b35; }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #f0f0f0;
    }

    .btn-secondary {
      background: white; border: 1px solid #ddd; padding: 0.7rem 1.3rem;
      border-radius: 10px; font-weight: 600; cursor: pointer; color: #666;
      transition: all 0.2s; font-size: 0.9rem;
    }
    .btn-secondary:hover { border-color: #999; color: #333; }

    .btn-primary {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      border: none; padding: 0.7rem 2rem; border-radius: 10px;
      color: white; font-weight: 700; cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
      transition: all 0.2s; font-size: 0.9rem;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; background: #ccc; box-shadow: none; }

    .error-msg { color: #dc3545; text-align: center; margin-top: 1rem; font-weight: 600; font-size: 0.9rem; }

    @media (max-width: 600px) {
      .card-body { padding: 1.5rem; }
      .grid-2 { grid-template-columns: 1fr; gap: 1.25rem; }
      .input-group { margin-bottom: 1rem; }
    }
  `]
})
export class CreateMaintenancePage implements OnInit {
  // ... (La lógica se mantiene idéntica, solo se actualizó HTML/CSS)
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
    details: '', dateOfService: null as Date | null,
    hourOfService: '', location: '', description: '', vehicleId: null as number | null
  };

  constructor() {
    effect(() => {
      if (!this.maintenanceStore.loading() && this.isSubmitting && !this.maintenanceStore.error()) {
        setTimeout(() => this.router.navigate(['/maintenances/mechanic']), 100);
      }
    });
  }

  ngOnInit(): void {
    const roleId = localStorage.getItem('role_id');
    if (roleId) {
      this.mechanicId = parseInt(roleId, 10);
      this.loadAssignments(this.mechanicId);
    }
  }

  private loadAssignments(mechanicId: number): void {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    this.http.get<any[]>(`${environment.platformProviderApiBaseUrl}/mechanic/${mechanicId}/assignments/ACTIVE`, { headers })
      .subscribe({
        next: (assignments) => this.activeAssignments = (assignments || []).map(a => new Assignment(a)),
        error: () => this.activeAssignments = []
      });
  }

  onOwnerChange(ownerId: number | string | null): void {
    const parsedId = ownerId ? Number(ownerId) : null;
    this.selectedOwnerIdValue = parsedId;
    if (parsedId) {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
      this.http.get<Vehicle[]>(`${environment.platformProviderApiBaseUrl}/vehicles/owner/${parsedId}`, { headers })
        .subscribe({
          next: (vehicles) => { this.ownerVehicles = vehicles; this.formData.vehicleId = null; },
          error: () => this.ownerVehicles = []
        });
    } else {
      this.ownerVehicles = []; this.formData.vehicleId = null;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid || !this.formData.dateOfService || !this.formData.hourOfService || !this.formData.vehicleId) return;
    this.isSubmitting = true;
    const date = new Date(this.formData.dateOfService);
    const [h, m] = this.formData.hourOfService.split(':');
    date.setHours(parseInt(h), parseInt(m), 0, 0);

    this.maintenanceStore.createMaintenance({
      details: this.formData.details,
      vehicleId: this.formData.vehicleId,
      dateOfService: date.toISOString(),
      location: this.formData.location,
      description: this.formData.description,
      mechanicId: this.mechanicId
    } as any);

    setTimeout(() => { if (this.maintenanceStore.error()) this.isSubmitting = false; }, 1000);
  }

  goBack(): void { this.router.navigate(['/maintenances/mechanic']); }
  getValidAssignments(): Assignment[] { return this.activeAssignments.filter(a => a.owner?.id); }
  getVehicleDisplay(v: Vehicle): string { return v.model ? `${v.model.brand} ${v.model.name} - ${v.plate}` : (v.plate || 'Vehicle'); }
}
