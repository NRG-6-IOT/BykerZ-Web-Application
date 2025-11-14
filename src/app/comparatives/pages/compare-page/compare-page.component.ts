import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { SpecsCardComponent } from '../../components/specs-card/specs-card.component';
import { ScenariosCardComponent } from '../../components/scenarios-card/scenarios-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { VehiclesApi } from '@app/vehiclemanagement/infrastructure/vehicles-api';
import { AuthenticationService } from '@app/iam/services/authentication.service';

@Component({
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, SpecsCardComponent, ScenariosCardComponent],
  selector: 'app-compare-page',
  template: `
    <div class="page">
      <div class="header">
        <h1 class="page-title">Vehicle Comparison</h1>
        <p class="subtitle">Compare the technical specifications of your motorcycles</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading vehicles...</p>
      </div>

      <div *ngIf="!loading && availableVehicles.length === 0" class="empty-state">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3>No vehicles available</h3>
        <p>You have no registered vehicles to compare.</p>
      </div>

      <div *ngIf="!loading && availableVehicles.length > 0" class="content">
        <div class="comparison-grid">
          <app-vehicle-card
            [vehicle]="ownerVehicle"
            title="Tu Moto"
            [selectable]="true"
            [options]="availableVehicles"
            (selectionChange)="onOwnerSelect($event)"
            [orange]="true">
          </app-vehicle-card>

          <div class="vs-divider">
            <span class="vs-text">VS</span>
          </div>

          <app-vehicle-card
            [vehicle]="compareVehicle"
            title="Comparar con"
            [selectable]="true"
            [options]="availableVehicles"
            (selectionChange)="onCompareSelect($event)"
            [orange]="true">
          </app-vehicle-card>
        </div>

        <div class="specs-section">
          <app-specs-card [owner]="ownerVehicle" [compare]="compareVehicle"></app-specs-card>
        </div>

        <div class="scenarios-section">
          <app-scenarios-card [owner]="ownerVehicle" [compare]="compareVehicle"></app-scenarios-card>
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
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
      padding: 3rem 0;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1rem 0;
      padding: 0 1rem;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1.3;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
      padding: 0 1rem;
      font-weight: 400;
      line-height: 1.6;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 2rem;
      gap: 1.5rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #ff6b35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .empty-state svg {
      color: #ddd;
      margin-bottom: 1.5rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: #1a1a1a;
      margin: 0 0 0.5rem 0;
      font-weight: 600;
    }

    .empty-state p {
      color: #666;
      font-size: 1rem;
      margin: 0;
    }

    .content {
      animation: fadeIn 0.5s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
      align-items: center;
    }

    .vs-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 1rem;
    }

    .vs-text {
      font-size: 2rem;
      font-weight: 700;
      color: #ff6b35;
      background: white;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
      border: 3px solid #fff;
    }

    .specs-section,
    .scenarios-section {
      margin-bottom: 2rem;
      animation: fadeIn 0.6s ease-in 0.2s both;
    }

    @media (max-width: 968px) {
      .comparison-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .vs-divider {
        transform: rotate(90deg);
        margin: 0;
      }

      .vs-text {
        width: 60px;
        height: 60px;
        font-size: 1.5rem;
      }

      .page {
        padding: 1.5rem;
      }

      .page-title {
        font-size: 2rem;
      }

      .header {
        margin-bottom: 2rem;
        padding: 1rem 0;
      }
    }

    @media (max-width: 640px) {
      .page {
        padding: 1rem;
      }

      .page-title {
        font-size: 1.75rem;
      }

      .subtitle {
        font-size: 0.95rem;
      }

      .vs-text {
        width: 50px;
        height: 50px;
        font-size: 1.25rem;
      }
    }
  `]
})
export class ComparePageComponent implements OnInit {
  ownerVehicle: Vehicle | null = null;
  compareVehicle: Vehicle | null = null;
  availableVehicles: Vehicle[] = [];
  loading: boolean = true;
  private currentOwnerId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesApi: VehiclesApi,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    console.log('[ComparePageComponent] Initializing...');

    this.authService.currentUserId.subscribe({
      next: (userId) => {
        if (userId) {
          this.currentOwnerId = userId;
          console.log('[ComparePageComponent] User ID:', userId);
          this.loadOwnerVehicles();
        } else {
          console.log('[ComparePageComponent] No user ID found');
          this.loading = false;
        }
      },
      error: () => {
        console.error('[ComparePageComponent] Error getting user ID');
        this.loading = false;
      }
    });
  }

  private loadOwnerVehicles(): void {
    this.loading = true;
    console.log('[ComparePageComponent] Loading vehicles for owner:', this.currentOwnerId);

    this.vehiclesApi.getVehiclesByOwnerId(this.currentOwnerId).subscribe({
      next: (vehicleEntities) => {
        console.log('[ComparePageComponent] Vehicles loaded:', vehicleEntities);

        // Convert from VehicleEntity (domain) to Vehicle (comparatives model)
        this.availableVehicles = vehicleEntities.map(entity => new Vehicle({
          id: entity.id,
          ownerId: entity.ownerId,
          model: entity.model,
          year: entity.year,
          plate: entity.plate
        }));

        console.log('[ComparePageComponent] Available vehicles:', this.availableVehicles);

        if (this.availableVehicles.length > 0) {
          // Read vehicleId from query params
          const vehicleIdParam = this.route.snapshot.queryParamMap.get('vehicleId');
          console.log('[ComparePageComponent] Vehicle ID from URL:', vehicleIdParam);

          if (vehicleIdParam) {
            const vehicleId = Number(vehicleIdParam);
            console.log('[ComparePageComponent] Searching for vehicle with ID:', vehicleId);

            const found = this.availableVehicles.find(v => v.id === vehicleId);

            if (found) {
              console.log('[ComparePageComponent] Found vehicle:', found);
              this.ownerVehicle = found;
            } else {
              console.log('[ComparePageComponent] Vehicle not found, using first available');
              this.ownerVehicle = this.availableVehicles[0];
            }
          } else {
            console.log('[ComparePageComponent] No vehicleId param, using first vehicle');
            this.ownerVehicle = this.availableVehicles[0];
          }

          // Select second vehicle for comparison
          if (this.availableVehicles.length > 1) {
            const differentVehicle = this.availableVehicles.find(v => v.id !== this.ownerVehicle?.id);
            this.compareVehicle = differentVehicle || this.availableVehicles[1];
          } else {
            this.compareVehicle = this.availableVehicles[0];
          }

          console.log('[ComparePageComponent] Owner vehicle selected:', this.ownerVehicle);
          console.log('[ComparePageComponent] Compare vehicle selected:', this.compareVehicle);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('[ComparePageComponent] Error loading vehicles:', err);
        if (err?.status === 404) {
          console.log('[ComparePageComponent] No vehicles found, redirecting to mechanic view');
          this.router.navigate(['/compare-mechanic']);
        }
        this.loading = false;
      }
    });
  }

  onOwnerSelect(id: number) {
    const selected = this.availableVehicles.find(v => v.id === id);
    if (selected) {
      this.ownerVehicle = selected;

      if (this.compareVehicle && this.compareVehicle.id === this.ownerVehicle.id) {
        const alternative = this.availableVehicles.find(v => v.id !== this.ownerVehicle?.id);
        this.compareVehicle = alternative || this.ownerVehicle;
      }
    }
  }

  onCompareSelect(id: number) {
    const selected = this.availableVehicles.find(v => v.id === id);
    if (selected) {
      this.compareVehicle = selected;
    }
  }
}
