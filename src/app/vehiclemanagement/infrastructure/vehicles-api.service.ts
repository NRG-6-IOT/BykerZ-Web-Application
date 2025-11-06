import { Injectable } from '@angular/core';
import {BaseService} from '@app/shared/services/base.service';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiclesApiService extends BaseService<Vehicle> {

  constructor() {
    super();
    this.resourceEndpoint = environment.vehiclesEndpoint;
  }

  CreateVehicleForOwner(ownerId: number, vehicle: Vehicle): Observable<Vehicle> {
    throw new Error('Method not implemented.');
  }

}
