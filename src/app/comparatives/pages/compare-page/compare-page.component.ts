import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

      <div *ngIf="isReady" class="content">
        <div class="comparison-grid">
          <app-vehicle-card
            [vehicle]="ownerVehicle"
            title="Your Bike"
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
            title="Compare With"
            [selectable]="true"
            [options]="availableModels"
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
  availableModels: Vehicle[] = [];
  loading: boolean = true;
  private currentOwnerId: number = 0;
  private readonly STORAGE_KEY = 'compare_page_state';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiclesApi: VehiclesApi,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let userId = this.authService.getCurrentUserIdSync();

    if (!userId) {
      const roleId = localStorage.getItem('role_id');
      userId = roleId ? Number(roleId) : null;
    }

    if (!userId) {
      userId = this.getUserIdFromToken();
    }

    if (userId) {
      this.currentOwnerId = userId;
      this.loadOwnerVehicles();
      this.loadAllModels();
    } else {
      this.authService.currentUserId.subscribe({
        next: (id) => {
          if (id && id !== this.currentOwnerId) {
            this.currentOwnerId = id;
            this.loadOwnerVehicles();
            this.loadAllModels();
          } else if (!id) {
            const tokenUserId = this.getUserIdFromToken();
            if (tokenUserId) {
              this.currentOwnerId = tokenUserId;
              this.loadOwnerVehicles();
              this.loadAllModels();
            } else {
              this.loading = false;
            }
          }
        },
        error: (err) => {
          this.loading = false;
        }
      });
    }
  }

  private getUserIdFromToken(): number | null {
    try {
      const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id || payload.userId || payload.sub;
        return userId ? Number(userId) : null;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  private saveState(): void {
    try {
      const state = {
        ownerVehicleId: this.ownerVehicle?.id,
        compareVehicleId: this.compareVehicle?.id,
        ownerId: this.currentOwnerId
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
    }
  }

  private getSavedState(): any {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        return state.ownerId === this.currentOwnerId ? state : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  private loadAllModels(): void {
    this.vehiclesApi.getAllModels().subscribe({
      next: (models) => {
        this.availableModels = models.map((model) => new Vehicle({
          id: model.id,
          ownerId: 0,
          model: model,
          year: model.modelYear,
          plate: `MODEL-${model.id}`
        }));
      },
      error: (error) => {
      }
    });
  }

  private loadOwnerVehicles(): void {
    if (!this.currentOwnerId) {
      this.loading = false;
      return;
    }

    this.loading = true;

    this.vehiclesApi.getVehiclesByOwnerId(this.currentOwnerId).subscribe({
      next: (vehicleEntities) => {
        this.availableVehicles = vehicleEntities.map(entity => new Vehicle({
          id: entity.id,
          ownerId: entity.owner?.id,
          model: entity.model,
          year: entity.year,
          plate: entity.plate
        }));

        if (this.availableVehicles.length > 0) {
          this.initializeSelection();
        }

        this.loading = false;
      },
      error: (err) => {
        if (err?.status === 404) {
          this.router.navigate(['/compare-mechanic']);
        }
        this.loading = false;
      }
    });
  }

  private initializeSelection(): void {
    const vehicleIdParam = this.route.snapshot.queryParamMap.get('vehicleId');
    const saved = this.getSavedState();

    let ownerId = vehicleIdParam ? Number(vehicleIdParam) : saved?.ownerVehicleId;

    if (ownerId) {
      const found = this.availableVehicles.find(v => v.id === ownerId);
      this.ownerVehicle = found || this.availableVehicles[0];
    } else {
      this.ownerVehicle = this.availableVehicles[0];
    }

    const compareId = saved?.compareVehicleId;
    if (compareId && this.availableModels.length > 0) {
      const found = this.availableModels.find(v =>
        (v.id === compareId || v.model?.id === compareId) &&
        v.model?.id !== this.ownerVehicle?.model?.id
      );
      this.compareVehicle = found ||
        this.availableModels.find(v => v.model?.id !== this.ownerVehicle?.model?.id) ||
        this.availableModels[0];
    } else if (this.availableModels.length > 0) {
      this.compareVehicle = this.availableModels.find(v =>
        v.model?.id !== this.ownerVehicle?.model?.id
      ) || this.availableModels[0];
    }

    this.saveState();
    this.cdr.detectChanges();
  }

  onOwnerSelect(id: number) {
    const selected = this.availableVehicles.find(v => v.id === id);
    if (selected) {
      this.ownerVehicle = new Vehicle({
        id: selected.id,
        ownerId: selected.ownerId,
        model: selected.model,
        year: selected.year,
        plate: selected.plate
      });

      if (this.compareVehicle && this.compareVehicle.model?.id === this.ownerVehicle.model?.id) {
        const alternative = this.availableModels.find(v =>
          v.model?.id !== this.ownerVehicle?.model?.id
        );
        if (alternative) {
          this.compareVehicle = new Vehicle({
            id: alternative.id,
            ownerId: alternative.ownerId,
            model: alternative.model,
            year: alternative.year,
            plate: alternative.plate
          });
        }
      }

      this.saveState();
      this.cdr.detectChanges();
    }
  }

  onCompareSelect(id: number) {
    const selected = this.availableModels.find(v => v.id === id);
    if (selected) {
      this.compareVehicle = new Vehicle({
        id: selected.id,
        ownerId: selected.ownerId,
        model: selected.model,
        year: selected.year,
        plate: selected.plate
      });

      this.saveState();
      this.cdr.detectChanges();
    }
  }

  get isReady(): boolean {
    return !this.loading &&
           this.availableVehicles.length > 0 &&
           this.availableModels.length > 0 &&
           this.ownerVehicle !== null &&
           this.compareVehicle !== null &&
           this.ownerVehicle.model !== null &&
           this.compareVehicle.model !== null;
  }
}
