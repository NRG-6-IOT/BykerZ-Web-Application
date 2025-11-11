import { Injectable } from '@angular/core';
import {VehiclesApiEndpoint} from '@app/vehiclemanagement/infrastructure/vehicles-api-endpoint';
import {ModelsApiEndpoint} from '@app/vehiclemanagement/infrastructure/models-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {VehiclesAssembler} from '@app/vehiclemanagement/infrastructure/vehicles-assembler';
import {ModelsAssembler} from '@app/vehiclemanagement/infrastructure/models-assembler';
import {BaseApi} from '@app/shared/infrastructure/base-api';
import {map, Observable} from 'rxjs';
import {Model, Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';

@Injectable({
  providedIn: 'root'
})
export class VehiclesApi extends BaseApi {
  private readonly vehiclesApiEndpoint: VehiclesApiEndpoint;
  private readonly modelsApiEndpoint: ModelsApiEndpoint;
  private readonly vehiclesAssembler = new VehiclesAssembler();
  private readonly modelsAssembler = new ModelsAssembler();

  constructor(http: HttpClient) {
    super();
    this.vehiclesApiEndpoint = new VehiclesApiEndpoint(http);
    this.modelsApiEndpoint = new ModelsApiEndpoint(http);
  }

  getVehicleById(vehicleId: number): Observable<Vehicle> {
    return this.vehiclesApiEndpoint.getById(vehicleId);
  }

  getVehiclesByOwnerId(ownerId: number): Observable<Vehicle[]> {
    return this.vehiclesApiEndpoint.getByOwnerId(ownerId).pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.vehiclesAssembler.toEntityFromResource(resource))
          : this.vehiclesAssembler.toEntitiesFromResponse(response)
      )
    );
  }

  getAllBrands(): Observable<String[]> {
    return this.modelsApiEndpoint.getAllBrands();
  }

  getAllModels(): Observable<Model[]> {
    return this.modelsApiEndpoint.getAll().pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.modelsAssembler.toEntityFromResource(resource))
          : this.modelsAssembler.toEntitiesFromResponse(response)
      )
    );
  }

  getModelsByBrand(brand: string): Observable<Model[]> {
    return this.modelsApiEndpoint.getModelsByBrand(brand).pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.modelsAssembler.toEntityFromResource(resource))
          : this.modelsAssembler.toEntitiesFromResponse(response)
      )
    );
  }

  addVehicleToOwner(ownerId: number, vehicleData: {plate: string; year: string; modelId: number}): Observable<Vehicle> {
    return this.vehiclesApiEndpoint.addVehicleToOwner(ownerId, vehicleData).pipe(
      map(response => {
        if (Array.isArray(response)) {
          throw new Error('Expected a single VehicleResource, but received an array.');
        }
        return this.vehiclesAssembler.toEntityFromResource(response);
      })
    );
  }


}
