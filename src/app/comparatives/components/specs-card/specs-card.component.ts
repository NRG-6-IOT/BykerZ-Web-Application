import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-specs-card',
  template: `
    <div class="card">
      <div class="card-header">Specs:</div>
      <div class="grid">
        <div class="specs-names">
          <div *ngFor="let r of rows" class="row">{{ r }}</div>
        </div>
        <!-- both columns -> orange background -->
        <div class="specs-col orange">
          <div *ngFor="let r of rows" class="row">{{ getOwnerSpec(r) }}</div>
        </div>
        <div class="specs-col orange">
          <div *ngFor="let r of rows" class="row">{{ getCompareSpec(r) }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card { background:#fff; border-radius:8px; padding:14px; color:#000; box-shadow:0 1px 6px rgba(0,0,0,0.04); }
    .card-header { font-weight:700; margin-bottom:10px; }
    .grid { display:grid; grid-template-columns: 160px 1fr 1fr; gap:8px; align-items:start; }
    .specs-names .row { padding:10px 8px; border-bottom:1px solid #f0f0f0; color:#000; }
    .specs-col { padding:0; }
    .specs-col .row { padding:10px 12px; border-bottom:1px solid rgba(0,0,0,0.04); background:#fff; color:#000; }
    /* orange for both data columns */
    .specs-col.orange .row { background:#FF6B35; color:#fff; }
    .row { font-size:13px; }
  `]
})
export class SpecsCardComponent {
  @Input() owner!: Vehicle | null;
  @Input() compare!: Vehicle | null;

  rows = [
    'Displacement',
    'Power',
    'Engine Torque',
    'Weight',
    'Transmission',
    'Brakes',
    'Tank',
    'Seat Height',
    'Consumption',
    'Price approx.'
  ];

  getOwnerSpec(row: string) {
    if (!this.owner) return '-';
    const m = this.owner.model;
    return this.mapRow(row, m);
  }
  getCompareSpec(row: string) {
    if (!this.compare) return '-';
    const m = this.compare.model;
    return this.mapRow(row, m);
  }

  mapRow(row: string, m: any) {
    switch (row) {
      case 'Displacement': return m.displacement || '-';
      case 'Power': return m.potency || '-';
      case 'Engine Torque': return m.engineTorque || '-';
      case 'Weight': return m.weight || '-';
      case 'Transmission': return m.transmission || '-';
      case 'Brakes': return m.brakes || '-';
      case 'Tank': return m.tank || '-';
      case 'Seat Height': return m.seatHeight || '-';
      case 'Consumption': return m.consumption || '-';
      case 'Price approx.': return m.price || '-';
      default: return '-';
    }
  }
}
