import {Component, input, Input, output} from '@angular/core';
import {WellnessMetric} from '@app/vehicle-wellness/domain/model/wellness-metric.entity';
import {MatListItem} from '@angular/material/list';


@Component({
  selector: 'app-wellness-metric-item',
  imports: [
  ],
  templateUrl: './wellness-metric-item.html',
  styleUrl: './wellness-metric-item.css'
})
export class WellnessMetricItem {

  wellnessMetric = input.required<WellnessMetric>();
  wellnessMetricSelected = output<WellnessMetric>();

  emitMetricSelectedEvent() {
    this.wellnessMetricSelected.emit(this.wellnessMetric());
  }

}
