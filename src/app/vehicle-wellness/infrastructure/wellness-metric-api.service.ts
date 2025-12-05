import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError, map, Observable} from 'rxjs';
import {WellnessMetric} from '@app/vehicle-wellness/domain/model/wellness-metric.entity';
import {
  CreateWellnessMetricResource, UpdateWellnessMetricResource,
  WellnessMetricResource,
  WellnessMetricsResponse
} from '@app/vehicle-wellness/infrastructure/wellness-metrics.response';
import {WellnessMetricAssembler} from '@app/vehicle-wellness/infrastructure/wellness-metric.assembler';

@Injectable({
  providedIn: 'root'
})
export class WellnessMetricApiService {
  private baseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderWellnessMetricEndpointPath}`;
  private http = inject(HttpClient);

  getWellnessMetricById(id: number): Observable<WellnessMetric>{
    return this.http.get<WellnessMetricResource>(`${this.baseUrl}/${id}`)
      .pipe(
        map(resource => WellnessMetricAssembler.toEntityFromResource(resource))
      );
  }

  getAllWellnessMetrics(): Observable<WellnessMetric[]>{
    return this.http.get<WellnessMetricResource[]>(this.baseUrl)
      .pipe(
        map(response => WellnessMetricAssembler.toEntitiesFromResponse(response))
      );
  }

  getWellnessMetricsByVehicleId(vehicleId: number): Observable<WellnessMetric[]>{
    return this.http.get<WellnessMetricResource[]>(`${this.baseUrl}/vehicle/${vehicleId}`)
      .pipe(
        map(response => WellnessMetricAssembler.toEntitiesFromResponse(response))
      );
  }

  createWellnessMetric(wellnessMetric: WellnessMetric): Observable<WellnessMetric> {
    const createResource=WellnessMetricAssembler.toResourceFromEntity(wellnessMetric);

    return this.http.post<WellnessMetricResource>(this.baseUrl, createResource)
      .pipe(
        map(resource => WellnessMetricAssembler.toEntityFromResource(resource))
      );
  }

  updateWellnessMetric(id: number, wellnessMetric: WellnessMetric): Observable<WellnessMetric> {
    const updateResource = WellnessMetricAssembler.toResourceFromEntity(wellnessMetric);
    return this.http.put<WellnessMetricResource>(`${this.baseUrl}/${id}`, updateResource)
      .pipe(
        map(resource => WellnessMetricAssembler.toEntityFromResource(resource))
      );
  }

  deleteWellnessMetric(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}


