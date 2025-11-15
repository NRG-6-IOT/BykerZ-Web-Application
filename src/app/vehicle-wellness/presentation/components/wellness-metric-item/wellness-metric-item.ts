import {Component, input, Input, output} from '@angular/core';
import {WellnessMetric} from '@app/vehicle-wellness/domain/model/wellness-metric.entity';
import {MatListItem} from '@angular/material/list';
import {DatePipe} from '@angular/common';
import {Component, inject, input, Input, output} from '@angular/core';
import {WellnessMetric} from '@app/metrics/domain/model/wellness-metric.entity';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';

@Component({
  selector: 'app-wellness-metric-item',
  imports: [
    DatePipe
  ],
  templateUrl: './wellness-metric-item.html',
  styleUrl: './wellness-metric-item.css'
})
export class WellnessMetricItem {

  wellnessMetric = input.required<WellnessMetric>();
  wellnessMetricSelected = output<WellnessMetric>();

  vehicleStore = inject(VehiclesStore)

  getVehicle(): Vehicle {
    return this.vehicleStore.getVehicleById(this.wellnessMetric().vehicleId)()!;
  }

  emitMetricSelectedEvent() {
    this.wellnessMetricSelected.emit(this.wellnessMetric());
  }

}
