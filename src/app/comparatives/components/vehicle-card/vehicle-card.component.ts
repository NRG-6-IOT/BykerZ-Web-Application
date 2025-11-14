import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../model/model';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <select
          *ngIf="selectable && options.length > 0"
          [(ngModel)]="selectedVehicleId"
          (ngModelChange)="onSelectionChange($event)"
          class="vehicle-select">
          <option *ngFor="let opt of options" [value]="opt.id">
            {{ opt.model.brand }} {{ opt.model.name }} - {{ opt.plate }}
          </option>
        </select>
      </div>

      <div class="card-body" *ngIf="vehicle">
        <div class="vehicle-image-container">
          <div class="vehicle-placeholder">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </div>
        </div>

        <div class="vehicle-info">
          <h2 class="vehicle-name">{{ vehicle.model.brand }} {{ vehicle.model.name }}</h2>
          <div class="vehicle-details">
            <div class="detail-item">
              <span class="detail-label">Year</span>
              <span class="detail-value">{{ vehicle.year }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Plate</span>
              <span class="detail-value">{{ vehicle.plate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Type</span>
              <span class="detail-value">{{ vehicle.model.type }}</span>
            </div>
          </div>
        </div>

        <div class="specs-preview">
          <div class="spec-badge">
            <div class="spec-value">{{ vehicle.model.displacement }}</div>
            <div class="spec-label">Displacement</div>
          </div>
          <div class="spec-badge">
            <div class="spec-value">{{ vehicle.model.potency }}</div>
            <div class="spec-label">Power</div>
          </div>
          <div class="spec-badge">
            <div class="spec-value">{{ vehicle.model.consumption }}</div>
            <div class="spec-label">Consumption</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      padding: 1.5rem;
      color: white;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1rem 0;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      font-size: 0.95rem;
    }

    .vehicle-select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .vehicle-select:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.5);
    }

    .vehicle-select:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.3);
      border-color: white;
    }

    .vehicle-select option {
      background: white;
      color: #1a1a1a;
      padding: 0.75rem;
    }

    .card-body {
      padding: 2rem;
    }

    .vehicle-image-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .vehicle-placeholder {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
    }

    .vehicle-placeholder svg {
      color: #ff6b35;
    }

    .vehicle-info {
      text-align: center;
      margin-bottom: 2rem;
    }

    .vehicle-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1.25rem 0;
      line-height: 1.3;
    }

    .vehicle-details {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .detail-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: #333;
    }

    .specs-preview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 2px solid #f5f5f5;
    }

    .spec-badge {
      background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%);
      padding: 1rem;
      border-radius: 12px;
      text-align: center;
      transition: transform 0.2s ease;
    }

    .spec-badge:hover {
      transform: scale(1.05);
    }

    .spec-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #ff6b35;
      margin-bottom: 0.35rem;
    }

    .spec-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    @media (max-width: 640px) {
      .card-body {
        padding: 1.5rem;
      }

      .vehicle-name {
        font-size: 1.25rem;
      }

      .vehicle-details {
        gap: 1.5rem;
      }

      .specs-preview {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .spec-badge {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .spec-value {
        font-size: 1rem;
        margin-bottom: 0;
      }

      .spec-label {
        font-size: 0.8rem;
      }
    }
  `]
})
export class VehicleCardComponent {
  @Input() set vehicle(value: Vehicle | null) {
    this._vehicle = value;
    if (value?.id) {
      this.selectedVehicleId = value.id;
    }
  }
  get vehicle(): Vehicle | null {
    return this._vehicle;
  }
  private _vehicle: Vehicle | null = null;

  @Input() title: string = '';
  @Input() selectable: boolean = false;
  @Input() options: Vehicle[] = [];
  @Input() orange: boolean = false;
  @Output() selectionChange = new EventEmitter<number>();

  selectedVehicleId: number | null = null;

  onSelectionChange(id: number) {
    this.selectionChange.emit(id);
  }
}
