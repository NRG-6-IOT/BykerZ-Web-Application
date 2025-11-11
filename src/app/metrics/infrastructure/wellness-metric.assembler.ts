import {WellnessMetricResource, WellnessMetricsResponse} from '@app/metrics/infrastructure/wellness-metrics.response';
import {WellnessMetric} from '@app/metrics/domain/model/wellness-metric.entity';

export class WellnessMetricAssembler {

  static toEntityFromResource(resource: WellnessMetricResource): WellnessMetric{
    return{
      id: resource.id,

      vehicleId: resource.vehicleId,

      latitude: resource.latitude,
      longitude: resource.longitude,

      CO2Ppm: resource.CO2Ppm,
      NH3Ppm: resource.NH3Ppm,
      BenzenePpm: resource.BenzenePpm,

      temperatureCelsius: resource.temperatureCelsius,
      humidityPercentage: resource.humidityPercentage,

      pressureHpa: resource.pressureHpa,

      impactDetected: resource.impactDetected,
    }
  }

  static toEntitiesFromResponse(response: WellnessMetricResource[]): WellnessMetric[] {
    return response.map(wellnessMetricResource => this.toEntityFromResource(wellnessMetricResource));
  }

  static toResourceFromEntity(entity: WellnessMetric): WellnessMetricResource{
    return{
      id: entity.id,

      vehicleId:  entity.vehicleId,

      latitude: entity.latitude,
      longitude: entity.longitude,

      CO2Ppm: entity.CO2Ppm,
      NH3Ppm: entity.NH3Ppm,
      BenzenePpm: entity.BenzenePpm,

      temperatureCelsius: entity.temperatureCelsius,
      humidityPercentage: entity.humidityPercentage,

      pressureHpa: entity.pressureHpa,

      impactDetected: entity.impactDetected,
    }
  }

}
