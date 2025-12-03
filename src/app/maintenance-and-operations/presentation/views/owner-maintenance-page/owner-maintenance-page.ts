import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {TranslateModule} from '@ngx-translate/core';

interface MaintenanceCard {
  maintenance: Maintenance;
  vehicle?: Vehicle;
  mechanicName?: string;
}

@Component({
  selector: 'app-owner-maintenance-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page">
      <div class="header">
        <h1 class="page-title">{{ 'navbar.owner.maintenance' | translate }}</h1>
        <p class="subtitle">{{ 'dashboard.owner.subtitle' | translate }}</p>
      </div>

      <div *ngIf="maintenanceStore.loading() || vehiclesStore.loading()" class="loading-container">
        <div class="spinner"></div>
        <p>{{ 'common.loading' | translate }}</p>
      </div>

      <div *ngIf="maintenanceStore.error()" class="empty-state">
        <p style="color: red">{{maintenanceStore.error()}}</p>
      </div>

      <div *ngIf="!maintenanceStore.loading()" class="content">
        <h2 class="section-title">{{ 'maintenance.scheduledTitle' | translate }}</h2>

        <div *ngIf="scheduledCards().length === 0" class="empty-state">
          <p>{{ 'maintenance.noScheduled' | translate }}</p>
        </div>

        <div class="grid-container">
          <div class="card" *ngFor="let card of scheduledCards()">
            <div class="card-header-gradient">
              <span class="card-date">{{ card.maintenance.dateOfService | date:'mediumDate' }}</span>
              <span class="status-badge" [ngClass]="card.maintenance.state.toLowerCase()">{{ card.maintenance.state }}</span>
            </div>
            <div class="card-body">
              <h3 class="vehicle-title">{{ getVehicleDisplay(card.vehicle) }}</h3>

              <div class="detail-row">
                <span class="label">{{ 'maintenance.mechanicLabel' | translate }}</span>
                <span class="value">{{ card.mechanicName || ('common.loading' | translate) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">{{ 'maintenance.locationLabel' | translate }}</span>
                <span class="value">{{ card.maintenance.location }}</span>
              </div>

              <div class="description-box">
                <p>{{ card.maintenance.details }}</p>
              </div>
            </div>
          </div>
        </div>

        <h2 class="section-title mt-5">{{ 'maintenance.historyTitle' | translate }}</h2>

        <div class="grid-container">
          <div class="card" *ngFor="let card of completedCards()">
            <div class="card-header-gradient done">
              <span class="card-date">{{ card.maintenance.dateOfService | date:'mediumDate' }}</span>
              <span class="status-badge" [ngClass]="card.maintenance.state.toLowerCase()">{{ card.maintenance.state }}</span>
            </div>
            <div class="card-body">
              <h3 class="vehicle-title">{{ getVehicleDisplay(card.vehicle) }}</h3>

              <div class="detail-row">
                <span class="label">{{ 'maintenance.mechanicLabel' | translate }}</span>
                <span class="value">{{ card.mechanicName || ('common.loading' | translate) }}</span>
              </div>

              <div class="description-box">
                <p>{{ card.maintenance.details }}</p>
              </div>

              <div class="actions" *ngIf="card.maintenance.expense">
                <button class="btn-primary" (click)="navigateToExpenseDetails(card.maintenance.expense.id)">
                  {{ 'maintenance.seeExpenseButton' | translate }} ($ {{card.maintenance.expense.finalPrice | number:'1.2-2'}})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .header { text-align: center; margin-bottom: 2rem; padding: 2rem 0; }

    .page-title {
      font-size: 2.5rem; font-weight: 700;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      margin: 0 0 0.5rem 0; letter-spacing: -0.5px;
    }

    .subtitle { font-size: 1.1rem; color: #666; margin: 0; }

    .section-title {
      font-size: 1.5rem; font-weight: 700; color: #1a1a1a;
      margin: 2rem 0 1rem 0; padding-left: 0.5rem;
      border-left: 4px solid #ff6b35;
    }
    .mt-5 { margin-top: 3rem; }

    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      display: flex; flex-direction: column;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header-gradient {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center;
      color: white;
    }
    .card-header-gradient.done {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }

    .card-date { font-weight: 600; font-size: 0.9rem; }

    .status-badge {
      background: rgba(255,255,255,0.2); backdrop-filter: blur(4px);
      padding: 0.25rem 0.75rem; border-radius: 20px;
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    }

    .card-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; flex: 1; }

    .vehicle-title { margin: 0; font-size: 1.2rem; font-weight: 700; color: #333; }

    .detail-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f5f5f5; padding-bottom: 0.5rem; }
    .label { font-size: 0.8rem; text-transform: uppercase; color: #999; font-weight: 600; }
    .value { font-size: 0.95rem; font-weight: 600; color: #333; }

    .description-box {
      background: #f9f9f9; padding: 1rem; border-radius: 8px;
      font-size: 0.9rem; color: #666; margin-top: auto;
    }

    .actions { margin-top: 1rem; }

    .btn-primary {
      width: 100%; padding: 0.75rem; border: none; border-radius: 12px;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; font-weight: 600; cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.9; }

    .loading-container { display: flex; flex-direction: column; align-items: center; padding: 3rem; }
    .spinner {
      width: 40px; height: 40px; border: 3px solid #f3f3f3;
      border-top: 3px solid #ff6b35; border-radius: 50%;
      animation: spin 1s linear infinite; margin-bottom: 1rem;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    .empty-state { text-align: center; color: #999; padding: 3rem; background: white; border-radius: 16px; }
  `]
})
export class OwnerMaintenancePage implements OnInit {
  readonly maintenanceStore = inject(MaintenanceStore);
  readonly vehiclesStore = inject(VehiclesStore);
  readonly router = inject(Router);
  readonly http = inject(HttpClient);

  private mechanicNamesCache = signal<Map<number, string>>(new Map());

  readonly scheduledCards = computed<MaintenanceCard[]>(() =>
    this.enrichMaintenances(this.maintenanceStore.scheduledMaintenances())
  );

  readonly completedCards = computed<MaintenanceCard[]>(() =>
    this.enrichMaintenances(this.maintenanceStore.completedMaintenances())
  );

  constructor() {
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
    if (!roleId) return;

    const ownerId = parseInt(roleId, 10);
    const vehicles = this.vehiclesStore.vehicles();

    if (vehicles.length === 0) {
      this.vehiclesStore.loadVehiclesByOwner(ownerId);
      setTimeout(() => this.loadMaintenancesForVehicles(), 500);
    } else {
      this.loadMaintenancesForVehicles();
    }
  }

  private loadMaintenancesForVehicles(): void {
    this.vehiclesStore.vehicles().forEach(vehicle => {
      this.maintenanceStore.loadMaintenancesByVehicleId(vehicle.id);
    });
  }

  private enrichMaintenances(maintenances: Maintenance[]): MaintenanceCard[] {
    return maintenances.map(maintenance => ({
      maintenance,
      vehicle: this.vehiclesStore.vehicles().find(v => v.id === maintenance.vehicleId),
      mechanicName: this.mechanicNamesCache().get(maintenance.mechanicId)
    }));
  }

  private loadMechanicName(mechanicId: number): void {
    const baseUrl = environment.platformProviderApiBaseUrl;
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });

    this.http.get<{id: number, username: string}>(`${baseUrl}/users/${mechanicId}`, { headers })
      .subscribe({
        next: (user) => this.mechanicNamesCache.update(cache => new Map(cache).set(mechanicId, user.username)),
        error: () => this.mechanicNamesCache.update(cache => new Map(cache).set(mechanicId, 'Unknown'))
      });
  }

  navigateToExpenseDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }

  getVehicleDisplay(vehicle?: Vehicle): string {
    if (!vehicle) return 'Loading...';
    return vehicle.model ? `${vehicle.model.brand} ${vehicle.model.name}` : (vehicle.plate || 'Vehicle');
  }
}
