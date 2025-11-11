import {computed, Injectable, Signal, signal} from '@angular/core';
import {Model, Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {VehiclesApi} from '@app/vehiclemanagement/infrastructure/vehicles-api';

@Injectable({
  providedIn: 'root'
})
export class VehiclesStore {
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly brandsSignal = signal<String[]>([]);

  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly brands = this.brandsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private vehiclesApi: VehiclesApi) {
    this.loadVehiclesByOwner(localStorage.getItem('role_id') ? +localStorage.getItem('role_id')! : 0);
    this.loadAllBrands();
  }

  loadVehiclesByOwner(ownerId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehiclesApi.getVehiclesByOwnerId(ownerId).subscribe({
      next: vehicles => {
        this.vehiclesSignal.set(vehicles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load vehicles'));
        this.loadingSignal.set(false);
      }
    });
  }

  loadAllBrands(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehiclesApi.getAllBrands().subscribe({
      next: brands => {
        this.brandsSignal.set(brands);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load brands'));
        this.loadingSignal.set(false);
      }
    });
  }

  addVehicleToOwner(ownerId: number, vehicleData: {plate: string; year: string; modelId: number}): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehiclesApi.addVehicleToOwner(ownerId, vehicleData).subscribe({
      next: vehicle => {
        this.vehiclesSignal.update(vehicles => [vehicle, ...vehicles]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to add vehicle'));
        this.loadingSignal.set(false);
      }
    });
  }

  getModelsByBrand(brand: string): Model[] {
    let models: Model[] = [];
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.vehiclesApi.getModelsByBrand(brand).subscribe({
      next: response => {
        models = response;
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load models'));
        this.loadingSignal.set(false);
      }
    });
    return models;
  }

  getVehicleById(vehicleId: number): Signal<Vehicle | undefined> {
    return computed(() => this.vehicles().find(v => v.id === vehicleId));
  }

  private formatError(error: any, fallback: string): string {
    if(error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

}
