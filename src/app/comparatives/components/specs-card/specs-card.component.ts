import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';

@Component({
  selector: 'app-specs-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="specs-card">
      <div class="card-header">
        <h2 class="section-title">Technical Specifications</h2>
        <p class="section-subtitle">Detailed comparison of features</p>
      </div>

      <div class="specs-grid" *ngIf="owner && compare">
        <div class="spec-row" *ngFor="let spec of specs">
          <div class="spec-name">{{ spec.label }}</div>
          <div class="spec-comparison">
            <div class="spec-value left" [class.winner]="isWinner(spec.key, 'owner')">
              {{ getSpecValue(owner, spec.key) }}
              <span class="winner-badge" *ngIf="isWinner(spec.key, 'owner')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
            </div>
            <div class="spec-divider"></div>
            <div class="spec-value right" [class.winner]="isWinner(spec.key, 'compare')">
              {{ getSpecValue(compare, spec.key) }}
              <span class="winner-badge" *ngIf="isWinner(spec.key, 'compare')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .specs-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 2rem;
      text-align: center;
    }

    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.3px;
    }

    .section-subtitle {
      font-size: 0.95rem;
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
      font-weight: 400;
    }

    .specs-grid {
      padding: 1.5rem;
    }

    .spec-row {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 2rem;
      padding: 1.25rem;
      border-bottom: 2px solid #f5f5f5;
      transition: background-color 0.2s ease;
    }

    .spec-row:last-child {
      border-bottom: none;
    }

    .spec-row:hover {
      background-color: #fafafa;
    }

    .spec-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      text-transform: capitalize;
    }

    .spec-comparison {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1.5rem;
      align-items: center;
    }

    .spec-value {
      font-size: 1rem;
      font-weight: 600;
      color: #666;
      padding: 0.75rem 1.25rem;
      background: #f8f8f8;
      border-radius: 10px;
      text-align: center;
      transition: all 0.3s ease;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .spec-value.winner {
      background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%);
      color: #ff6b35;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
    }

    .winner-badge {
      color: #ff6b35;
      display: flex;
      align-items: center;
    }

    .spec-divider {
      width: 2px;
      height: 24px;
      background: linear-gradient(to bottom, transparent, #e0e0e0, transparent);
    }

    @media (max-width: 968px) {
      .spec-row {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .spec-name {
        font-size: 0.9rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #f0f0f0;
      }

      .spec-comparison {
        grid-template-columns: 1fr;
        gap: 0.75rem;
      }

      .spec-divider {
        display: none;
      }

      .spec-value {
        font-size: 0.95rem;
      }
    }

    @media (max-width: 640px) {
      .section-title {
        font-size: 1.5rem;
      }

      .card-header {
        padding: 1.5rem;
      }

      .specs-grid {
        padding: 1rem;
      }

      .spec-row {
        padding: 1rem;
      }
    }
  `]
})
export class SpecsCardComponent implements OnChanges {
  @Input() owner!: Vehicle | null;
  @Input() compare!: Vehicle | null;

  specs = [
    { key: 'displacement', label: 'Displacement' },
    { key: 'potency', label: 'Power' },
    { key: 'engineTorque', label: 'Engine Torque' },
    { key: 'weight', label: 'Weight' },
    { key: 'transmission', label: 'Transmission' },
    { key: 'brakes', label: 'Brakes' },
    { key: 'tank', label: 'Tank' },
    { key: 'seatHeight', label: 'Seat Height' },
    { key: 'consumption', label: 'Consumption' },
    { key: 'price', label: 'Approx. Price' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['owner'] || changes['compare']) {
    }
  }

  getSpecValue(vehicle: Vehicle | null, key: string) {
    if (!vehicle || !vehicle.model) return '-';
    const value = (vehicle.model as any)[key];
    return value !== undefined && value !== null && value !== '' ? value : '-';
  }

  isWinner(key: string, type: 'owner' | 'compare') {
    if (!this.owner || !this.compare || !this.owner.model || !this.compare.model) return false;
    const ownerValue = (this.owner.model as any)[key];
    const compareValue = (this.compare.model as any)[key];
    if (ownerValue === compareValue || ownerValue == null || compareValue == null) return false;
    return ownerValue > compareValue ? type === 'owner' : type === 'compare';
  }
}
