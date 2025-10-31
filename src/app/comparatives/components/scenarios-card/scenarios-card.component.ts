import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  selector: 'app-scenarios-card',
  template: `
    <div class="card">
      <div class="card-header">Scenarios:</div>
      <div class="grid">
        <div class="scen-names">
          <div *ngFor="let s of scenarios" class="row">{{ s }}</div>
        </div>
        <!-- both scenario columns use orange background -->
        <div class="scen-col orange">
          <div *ngFor="let s of scenarios" class="row">
            <!-- override star color to black while cell text stays white -->
            <app-star-rating [score]="getOwnerScenarioScore(s)" style="color: #000;"></app-star-rating>
          </div>
        </div>
        <div class="scen-col orange">
          <div *ngFor="let s of scenarios" class="row">
            <app-star-rating [score]="getCompareScenarioScore(s)" style="color: #000;"></app-star-rating>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { background:#fff; border-radius:8px; padding:14px; color:#000; box-shadow:0 1px 6px rgba(0,0,0,0.04); }
    .card-header { font-weight:700; margin-bottom:10px; }
    .grid { display:grid; grid-template-columns: 160px 1fr 1fr; gap:8px; align-items:center; }
    .scen-names .row { padding:12px 8px; }
    .scen-col .row { padding:10px 12px; }
    .scen-col.orange .row { background:#FF6B35; color:#fff; border-radius:6px; display:flex; align-items:center; }
    /* ensure star size and spacing are appropriate */
    app-star-rating { font-size:18px; }
  `]
})
export class ScenariosCardComponent {
  @Input() owner!: Vehicle | null;
  @Input() compare!: Vehicle | null;

  scenarios = ['Traffic','Trips','Maintenance','Resale'];

  // Mock scoring: derive some values from model ids as example. In real app replace with logic.
  getOwnerScenarioScore(s: string) {
    if (!this.owner) return 0;
    return this.mockScore(this.owner.id, s);
  }
  getCompareScenarioScore(s: string) {
    if (!this.compare) return 0;
    return this.mockScore(this.compare.id, s);
  }

  mockScore(vehicleId: number, scenario: string) {
    // produce a repeatable 1-10 value with halves
    const base = (vehicleId * 3 + scenario.length) % 10 + 1; // 1..10
    const half = ((vehicleId + scenario.length) % 2) ? 0.5 : 0; // sometimes halves
    return Math.min(10, base + half);
  }
}
