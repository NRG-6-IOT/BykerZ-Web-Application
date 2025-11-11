import {BaseResponse} from '@app/shared/infrastructure/base-response';

export interface WellnessMetricsResponse extends BaseResponse {
  wellnessMetrics: WellnessMetricResource[];
}

export interface WellnessMetricResource {
  id: number;

  vehicleId: number;

  latitude: number;
  longitude: number;

  CO2Ppm: number;
  NH3Ppm: number;
  BenzenePpm: number;

  temperatureCelsius: number;
  humidityPercentage: number;

  pressureHpa: number;

  impactDetected: boolean;
}

export interface CreateWellnessMetricResource{
  vehicleId:number,

  latitude:number,
  longitude:number,

  CO2Ppm:number,
  NH3Ppm:number,
  BenzenePpm:number,

  temperatureCelsius:number,
  humidityPercentage:number,

  pressureHpa:number,

  impactDetected:boolean
}

export interface UpdateWellnessMetricResource{

  latitude?:number,
  longitude?:number,

  CO2Ppm?:number,
  NH3Ppm?:number,
  BenzenePpm?:number,

  temperatureCelsius?:number,
  humidityPercentage?:number,

  pressureHpa?:number,

  impactDetected?:boolean

}
