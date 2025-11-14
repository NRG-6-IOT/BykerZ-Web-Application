import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {Model} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {ModelResource, ModelsResponse} from '@app/vehiclemanagement/infrastructure/vehicles-response';
import {ModelsAssembler} from '@app/vehiclemanagement/infrastructure/models-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

const modelsApiBaseUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderModelsEndpointPath}`;

export class ModelsApiEndpoint extends BaseApiEndpoint<Model, ModelResource, ModelsResponse, ModelsAssembler> {

  constructor(http: HttpClient) {
    super(http, modelsApiBaseUrl, new ModelsAssembler());
    console.log('[ModelsApiEndpoint] Initialized with base URL:', modelsApiBaseUrl);
  }

  getAllBrands(): Observable<String[]> {
    console.log('[ModelsApiEndpoint] Fetching all brands...');
    return this.http.get<String[]>(`${this.endpointUrl}/brands`).pipe(
      catchError(this.handleError('Failed to fetch brands'))
    );
  }

  getModelsByBrand(brand: string): Observable<ModelsResponse | ModelResource[]> {
    console.log('[ModelsApiEndpoint] Fetching models for brand:', brand);
    return this.http.get<ModelsResponse | ModelResource[]>(`${this.endpointUrl}/brand/${brand}`).pipe(
      catchError(this.handleError(`Failed to fetch models for brand=${brand}`))
    );
  }


}
