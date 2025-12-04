import { Component } from '@angular/core';
import {WellnessMetricList} from '@app/vehicle-wellness/presentation/components/wellness-metric-list/wellness-metric-list';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-wellness-metric-page',
  imports: [WellnessMetricList, TranslatePipe],
  templateUrl: './wellness-metric-page.html',
  styleUrl: './wellness-metric-page.css'
})
export class WellnessMetricPage {

}
