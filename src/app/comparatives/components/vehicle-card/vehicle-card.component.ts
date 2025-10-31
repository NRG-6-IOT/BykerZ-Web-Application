import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../model/model';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-vehicle-card',
  template: `
    <div class="vehicle-card" [class.orange]="orange">
      <div class="top">
        <div class="title">{{ title }}</div>
        <div *ngIf="!selectable" class="subtitle">{{ vehicle?.model?.brand }} - {{ vehicle?.model?.name }}</div>
        <div *ngIf="selectable" class="selector">
          <label class="sr-only">Select model</label>
          <select (change)="onSelect($event)">
            <option *ngFor="let v of options" [value]="v.id" [selected]="v.id===vehicle?.id">
              {{ v.model.brand }} {{ v.model.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="meta">
        <div class="meta-item"><strong>Year:</strong> {{ vehicle?.year }}</div>
        <div class="meta-item"><strong>Plate:</strong> {{ vehicle?.plate }}</div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-card { padding: 14px; border-radius: 8px; background: #fff; color: #000; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .vehicle-card.orange { background: #FF6B35; color: #fff; }
    .vehicle-card .top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
    .vehicle-card .title { font-weight:700; font-size:14px; color:inherit; }
    .vehicle-card .subtitle { font-size:13px; opacity:0.95; }
    .vehicle-card select { padding:6px 8px; border-radius:6px; border:1px solid rgba(0,0,0,0.08); }
    .meta { margin-top:10px; display:flex; gap:12px; font-size:13px; color:inherit; }
    .meta-item strong { color:inherit; }
    .sr-only { position:absolute; left:-9999px; }
  `]
})
export class VehicleCardComponent {
  @Input() vehicle: Vehicle | null = null;
  @Input() title: string = '';
  @Input() selectable: boolean = false;
  @Input() options: Vehicle[] = [];
  @Input() orange: boolean = false;
  @Output() selectionChange = new EventEmitter<number>();

  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    const id = select ? Number(select.value) : NaN;
    if (!isNaN(id)) this.selectionChange.emit(id);
  }
}
