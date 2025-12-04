import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WellnessMetricItem} from '@app/vehicle-wellness/presentation/components/wellness-metric-item/wellness-metric-item';
import {MetricsStore} from '@app/vehicle-wellness/application/metrics.store';
import {WellnessMetric} from '@app/vehicle-wellness/domain/model/wellness-metric.entity';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-wellness-metric-list',
  imports: [CommonModule, WellnessMetricItem, TranslatePipe], // ← AGREGA LOS IMPORTS
  templateUrl: './wellness-metric-list.html',
  styleUrl: './wellness-metric-list.css'
})
export class WellnessMetricList implements OnInit {

  // 1. Inyecta el store
  store = inject(MetricsStore);
  private route = inject(ActivatedRoute);

  // 2. Usa el computed del store
  metrics = this.store.metrics;

  ngOnInit() {
    // Obtén el vehicleId de los query parameters
    this.route.queryParams.subscribe(params => {
      const vehicleId = params['vehicleId'];

      console.log('🚗 Vehicle ID from URL:', vehicleId);

      if (vehicleId) {
        // Carga las métricas específicas del vehículo
        this.store.loadMetricsByVehicleId(vehicleId); // ← Usa loadMetricsByVehicleId
      } else {
        // Si no hay vehicleId, carga todas las métricas
        this.store.loadAllMetrics();
      }
    });
  }

  // 4. Maneja el evento cuando se selecciona una métrica
  onMetricSelected(metric: WellnessMetric) {
    console.log('Métrica seleccionada:', metric);
    // Aquí puedes hacer algo con la métrica seleccionada
  }
}
