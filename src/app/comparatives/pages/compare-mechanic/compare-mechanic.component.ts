import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { SpecsCardComponent } from '../../components/specs-card/specs-card.component';
import { ScenariosCardComponent } from '../../components/scenarios-card/scenarios-card.component';
import { VehiclesApi } from '@app/vehiclemanagement/infrastructure/vehicles-api';
import { ActivatedRoute } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, SpecsCardComponent, ScenariosCardComponent, TranslateModule],
  selector: 'app-compare-mechanic',
  template: `
    <div class="page">
      <div class="header">
        <div class="badge">{{ 'comparative.mechanicPage.badge' | translate }}</div>
        <h1 class="page-title">{{ 'comparative.mechanicPage.title' | translate }}</h1>
        <p class="subtitle">{{ 'comparative.mechanicPage.subtitle' | translate }}</p>
      </div>

      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>{{ 'comparative.common.loadingModels' | translate }}</p>
      </div>

      <div *ngIf="!loading && availableVehicles.length === 0" class="empty-state">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3>{{ 'comparative.common.noModelsTitle' | translate }}</h3>
        <p>{{ 'comparative.common.noModelsMsg' | translate }}</p>
      </div>

      <div *ngIf="isReady" class="content">
        <div class="comparison-grid">
          <app-vehicle-card
            [vehicle]="leftVehicle"
            [title]="'comparative.mechanicPage.modelA' | translate"
            [selectable]="true"
            [options]="availableVehicles"
            (selectionChange)="onLeftSelect($event)"
            [orange]="true">
          </app-vehicle-card>

          <div class="vs-divider">
            <span class="vs-text">{{ 'comparative.common.vs' | translate }}</span>
          </div>

          <app-vehicle-card
            [vehicle]="rightVehicle"
            [title]="'comparative.mechanicPage.modelB' | translate"
            [selectable]="true"
            [options]="availableVehicles"
            (selectionChange)="onRightSelect($event)"
            [orange]="true">
          </app-vehicle-card>
        </div>

        <div class="specs-section">
          <app-specs-card [owner]="leftVehicle" [compare]="rightVehicle"></app-specs-card>
        </div>

        <div class="scenarios-section">
          <app-scenarios-card [owner]="leftVehicle" [compare]="rightVehicle"></app-scenarios-card>
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
      position: relative;
    }

    .badge {
      display: inline-block;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white;
      padding: 0.5rem 1.5rem;
      border-radius: 50px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 1rem;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
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

      .badge {
        font-size: 0.75rem;
        padding: 0.4rem 1.2rem;
      }
    }
  `]
})
export class CompareMechanicComponent implements OnInit {
  leftVehicle: Vehicle | null = null;
  rightVehicle: Vehicle | null = null;
  availableVehicles: Vehicle[] = [];
  loading: boolean = true;
  private readonly STORAGE_KEY = 'compare_mechanic_state';

  constructor(
    private vehiclesApi: VehiclesApi,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllModels();
  }

  private loadAllModels(): void {
    this.loading = true;

    this.vehiclesApi.getAllModels().subscribe({
      next: (models) => {
        this.availableVehicles = models.map((model) => new Vehicle({
          id: model.id,
          ownerId: 0,
          model: model,
          year: model.modelYear,
          plate: `MODEL-${model.id}`
        }));

        if (this.availableVehicles.length > 0) {
          this.initializeSelection();
        }

        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }

  private initializeSelection(): void {
    const vehicleIdParam = this.route.snapshot.queryParamMap.get('vehicleId');
    const saved = this.getSavedState();

    let leftId = vehicleIdParam ? Number(vehicleIdParam) : saved?.leftVehicleId;

    if (leftId) {
      const found = this.availableVehicles.find(v =>
        v.id === leftId || v.model?.id === leftId
      );
      this.leftVehicle = found || this.availableVehicles[0];
    } else {
      this.leftVehicle = this.availableVehicles[0];
    }

    const rightId = saved?.rightVehicleId;
    if (rightId && this.availableVehicles.length > 1) {
      const found = this.availableVehicles.find(v =>
        (v.id === rightId || v.model?.id === rightId) &&
        v.id !== this.leftVehicle?.id
      );
      this.rightVehicle = found ||
        this.availableVehicles.find(v => v.id !== this.leftVehicle?.id) ||
        this.availableVehicles[1];
    } else if (this.availableVehicles.length > 1) {
      this.rightVehicle = this.availableVehicles.find(v =>
        v.id !== this.leftVehicle?.id
      ) || this.availableVehicles[1];
    } else {
      this.rightVehicle = this.availableVehicles[0];
    }

    this.saveState();
    this.cdr.detectChanges();
  }

  private saveState(): void {
    try {
      const state = {
        leftVehicleId: this.leftVehicle?.id,
        rightVehicleId: this.rightVehicle?.id
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
    }
  }

  private getSavedState(): any {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  onLeftSelect(id: number) {
    const selected = this.availableVehicles.find(v => v.id === id);
    if (selected) {
      this.leftVehicle = new Vehicle({
        id: selected.id,
        ownerId: selected.ownerId,
        model: selected.model,
        year: selected.year,
        plate: selected.plate
      });

      if (this.rightVehicle && this.rightVehicle.id === this.leftVehicle.id) {
        const alternative = this.availableVehicles.find(v =>
          v.id !== this.leftVehicle?.id
        );
        if (alternative) {
          this.rightVehicle = new Vehicle({
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

  onRightSelect(id: number) {
    const selected = this.availableVehicles.find(v => v.id === id);
    if (selected) {
      this.rightVehicle = new Vehicle({
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
           this.leftVehicle !== null &&
           this.rightVehicle !== null &&
           this.leftVehicle.model !== null &&
           this.rightVehicle.model !== null;
  }
}
