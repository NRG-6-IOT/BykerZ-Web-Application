export interface VehicleComparison {
  id: string;
  brand: string;
  model: string;
  year: number;
  imageUrl: string;
  rating: number;
  price?: number;
  specs: VehicleSpecs;
  scenarios: ScenarioRatings;
}

export interface VehicleSpecs {
  engine: string;
  horsepower: number;
  transmission: string;
  fuelType: string;
  mileage: number;
  condition: string;
}

export interface ScenarioRatings {
  city: number;
  highway: number;
  offroad: number;
  comfort: number;
  cargo: number;
}

