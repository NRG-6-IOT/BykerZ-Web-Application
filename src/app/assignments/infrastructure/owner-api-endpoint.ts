import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Owner} from '@app/assignments/domain/model/owner.entity';
import {OwnerResource, OwnerResponse} from '@app/assignments/infrastructure/owner-response';
import {OwnerAssembler} from '@app/assignments/infrastructure/owner-assembler';

const ownerEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderOwnerEndpointPath}`

export class OwnerApiEndpoint extends BaseApiEndpoint<Owner,OwnerResource, OwnerResponse, OwnerAssembler>{
  constructor(http: HttpClient) {
    super( http, ownerEndpointUrl, new OwnerAssembler());
  };
}
