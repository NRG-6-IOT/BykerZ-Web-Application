import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {
  VehicleResource,
  VehicleResponse,
  VehiclesResponse
} from '@app/vehiclemanagement/infrastructure/vehicles-response';
import {VehiclesAssembler} from '@app/vehiclemanagement/infrastructure/vehicles-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, tap} from 'rxjs';

const vehiclesEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`;

export class VehiclesApiEndpoint extends BaseApiEndpoint<Vehicle, VehicleResource, VehiclesResponse, VehiclesAssembler> {
  constructor(http: HttpClient) {
    super(http, vehiclesEndpointUrl, new VehiclesAssembler());
  }

  getByOwnerId(ownerId: number): Observable<VehiclesResponse | VehicleResource[]> {
    return this.http.get<VehiclesResponse | VehicleResource[]>(`${this.endpointUrl}/owner/${ownerId}`).pipe(
      tap(response => console.log('API Response for ownerId', ownerId, ':', response)),
      catchError(this.handleError(`Failed to fetch vehicles for ownerId=${ownerId}`))
    );
  }

  addVehicleToOwner(ownerId: number, vehicleData: {plate: string; year: string; modelId: number}): Observable<VehicleResource> {
    return this.http.post<VehicleResource>(`${this.endpointUrl}/${ownerId}`, vehicleData).pipe(
      catchError(this.handleError(`Failed to add vehicle for ownerId=${ownerId}`))
    );
  }
}
