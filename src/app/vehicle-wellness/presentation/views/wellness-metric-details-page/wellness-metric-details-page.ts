import { Component } from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-wellness-metric-details-page',
  imports: [
    TranslatePipe
  ],
  templateUrl: './wellness-metric-details-page.html',
  styleUrl: './wellness-metric-details-page.css'
})
export class WellnessMetricDetailsPage {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}
