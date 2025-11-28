import { Component, Input, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scenarios-card',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scenarios-card">
      <div class="card-header">
        <h2 class="section-title">{{ 'comparative.scenarios.title' | translate }}</h2>
        <p class="section-subtitle">{{ 'comparative.scenarios.subtitle' | translate }}</p>
      </div>

      <div class="scenarios-grid" *ngIf="owner && compare">
        <div class="scenario-card" *ngFor="let scenario of scenarios">
          <div class="scenario-header">
            <div class="scenario-icon">{{ scenario.icon }}</div>
            <h3 class="scenario-title">{{ scenario.name | translate }}</h3>
          </div>

          <div class="scenario-comparison">
            <div class="scenario-bar-container">
              <div class="scenario-label">
                <span class="vehicle-name">{{ owner.model.name }}</span>
                <div class="stars-container">
                  <span *ngFor="let star of getStarsArray(scenario.ownerScore)" class="star filled">★</span>
                  <span *ngFor="let star of getStarsArray(10 - scenario.ownerScore)" class="star empty">★</span>
                </div>
              </div>
            </div>

            <div class="scenario-bar-container">
              <div class="scenario-label">
                <span class="vehicle-name">{{ compare.model.name }}</span>
                <div class="stars-container">
                  <span *ngFor="let star of getStarsArray(scenario.compareScore)" class="star filled">★</span>
                  <span *ngFor="let star of getStarsArray(10 - scenario.compareScore)" class="star empty">★</span>
                </div>
              </div>
            </div>
          </div>

          <div class="scenario-winner" *ngIf="scenario.ownerScore !== scenario.compareScore">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ 'comparative.scenarios.betterFor' | translate: { vehicle: (scenario.ownerScore > scenario.compareScore ? owner.model.name : compare.model.name) } }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scenarios-card {
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

    .scenarios-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 2rem;
    }

    .scenario-card {
      background: #fafafa;
      border-radius: 12px;
      padding: 1.75rem;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .scenario-card:hover {
      background: white;
      border-color: #ff6b35;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.1);
      transform: translateY(-2px);
    }

    .scenario-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .scenario-icon {
      font-size: 2rem;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
    }

    .scenario-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0;
      letter-spacing: -0.2px;
    }

    .scenario-comparison {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
    }

    .scenario-bar-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .scenario-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .vehicle-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
      flex-shrink: 0;
    }

    .stars-container {
      display: flex;
      gap: 0.15rem;
      font-size: 1.1rem;
      line-height: 1;
    }

    .star {
      transition: all 0.2s ease;
    }

    .star.filled {
      color: #ff6b35;
      text-shadow: 0 0 4px rgba(255, 107, 53, 0.3);
    }

    .star.empty {
      color: #e0e0e0;
    }

    .scenario-winner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%);
      border-radius: 8px;
      color: #ff6b35;
      font-size: 0.85rem;
      font-weight: 600;
      margin-top: 1rem;
    }

    .scenario-winner svg {
      flex-shrink: 0;
    }

    @media (max-width: 640px) {
      .section-title {
        font-size: 1.5rem;
      }

      .card-header {
        padding: 1.5rem;
      }

      .scenarios-grid {
        grid-template-columns: 1fr;
        padding: 1.5rem;
        gap: 1.25rem;
      }

      .scenario-card {
        padding: 1.5rem;
      }

      .scenario-title {
        font-size: 1rem;
      }

      .scenario-icon {
        font-size: 1.5rem;
        width: 48px;
        height: 48px;
      }

      .scenario-label {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .stars-container {
        font-size: 1rem;
      }
    }
  `]
})
export class ScenariosCardComponent implements OnChanges {
  @Input() owner!: Vehicle | null;
  @Input() compare!: Vehicle | null;

  scenarios = [
    { name: 'comparative.scenarios.types.cityTraffic', icon: '🚦', ownerScore: 0, compareScore: 0 },
    { name: 'comparative.scenarios.types.longTrips', icon: '🛣️', ownerScore: 0, compareScore: 0 },
    { name: 'comparative.scenarios.types.maintenanceCost', icon: '🔧', ownerScore: 0, compareScore: 0 },
    { name: 'comparative.scenarios.types.resaleValue', icon: '💰', ownerScore: 0, compareScore: 0 }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['owner'] || changes['compare']) && this.owner && this.compare) {
      this.updateScenarios();
    }
  }

  private updateScenarios() {
    this.scenarios = this.scenarios.map(scenario => ({
      ...scenario,
      ownerScore: this.getOwnerScenarioScore(scenario.name),
      compareScore: this.getCompareScenarioScore(scenario.name)
    }));
  }

  getOwnerScenarioScore(s: string) {
    if (!this.owner || !this.owner.id) return 0;
    return this.mockScore(this.owner.id, s);
  }

  getCompareScenarioScore(s: string) {
    if (!this.compare || !this.compare.id) return 0;
    return this.mockScore(this.compare.id, s);
  }

  mockScore(vehicleId: number, scenario: string) {
    const base = (vehicleId * 3 + scenario.length) % 10 + 1;
    return Math.min(10, base);
  }

  getStarsArray(count: number): number[] {
    return Array(Math.floor(count)).fill(0);
  }
}
