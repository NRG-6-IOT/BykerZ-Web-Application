import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Mechanic} from '@app/assignments/domain/model/mechanic.entity';
import {MechanicResource, MechanicResponse} from '@app/assignments/infrastructure/mechanic-response';
import {MechanicAssembler} from '@app/assignments/infrastructure/mechanic-assembler';

const mechanicEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderMechanicEndpointPath}`

export class MechanicApiEndpoint extends BaseApiEndpoint<Mechanic,MechanicResource, MechanicResponse, MechanicAssembler>{
  constructor(http: HttpClient) {
    super( http, mechanicEndpointUrl, new MechanicAssembler());
  };

}
