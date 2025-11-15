export class WellnessMetric {
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

  registeredAt: Date;

  constructor() {
    this.id = 0;
    this.vehicleId = 0;
    this.latitude = 0;
    this.longitude = 0;
    this.CO2Ppm = 0;
    this.NH3Ppm = 0;
    this.BenzenePpm = 0;
    this.temperatureCelsius = 0;
    this.humidityPercentage = 0;
    this.pressureHpa = 0;
    this.impactDetected = false;
    this.registeredAt= new Date();
  }

}
