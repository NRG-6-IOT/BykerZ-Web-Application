import { computed, inject, Injectable, signal } from '@angular/core';
import { WellnessMetricApiService } from '@app/vehicle-wellness/infrastructure/wellness-metric-api.service';
import { WellnessMetric } from '@app/vehicle-wellness/domain/model/wellness-metric.entity';

@Injectable({
  providedIn: 'root'
})
export class MetricsStore {
  private metricsSignal = signal<WellnessMetric[]>([]);

  readonly metrics = computed(() => this.metricsSignal());

  private wellnessMetricsApiService = inject(WellnessMetricApiService);

  loadAllMetrics(): void {
    this.wellnessMetricsApiService.getAllWellnessMetrics()
      .subscribe(wellnessMetrics => {
        this.metricsSignal.set(wellnessMetrics);
      });
  }

  loadMetricsByVehicleId(vehicleId: number): void {
    this.wellnessMetricsApiService.getWellnessMetricsByVehicleId(vehicleId)
      .subscribe(metrics => {
        this.metricsSignal.set(metrics);
      });
  }

  loadMetricById(id: number): void {
    this.wellnessMetricsApiService.getWellnessMetricById(id)
      .subscribe(metric => {
        const currentMetrics = this.metricsSignal();
        const existingIndex = currentMetrics.findIndex(m => m.id === metric.id);

        let updatedMetrics: WellnessMetric[];
        if (existingIndex >= 0) {
          updatedMetrics = [...currentMetrics];
          updatedMetrics[existingIndex] = metric;
        } else {
          updatedMetrics = [...currentMetrics, metric];
        }

        this.metricsSignal.set(updatedMetrics);
      });
  }

  deleteMetric(id: number): void {
    this.wellnessMetricsApiService.deleteWellnessMetric(id)
      .subscribe(() => {
        this.metricsSignal.update(metrics =>
          metrics.filter(metric => metric.id !== id)
        );
      });
  }

  createMetric(wellnessMetric: WellnessMetric): void {
    this.wellnessMetricsApiService.createWellnessMetric(wellnessMetric)
      .subscribe(newMetric => {
        this.metricsSignal.update(metrics => [...metrics, newMetric]);
      });
  }

  updateMetric(updatedWellnessMetric: WellnessMetric): void {
    this.wellnessMetricsApiService.updateWellnessMetric(
      updatedWellnessMetric.id,
      updatedWellnessMetric
    ).subscribe(updatedMetric => {
      this.metricsSignal.update(metrics =>
        metrics.map(metric => metric.id === updatedWellnessMetric.id ? updatedMetric : metric)
      );
    });
  }

  reset(): void {
    this.metricsSignal.set([]);
  }
}
