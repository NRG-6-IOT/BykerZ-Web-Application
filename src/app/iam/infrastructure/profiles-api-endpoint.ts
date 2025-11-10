import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {Profile} from '../domain/model/profile.entity';
import {HttpClient} from '@angular/common/http';
import {ProfileResource, ProfileResponse} from './profiles-response';
import {ProfilesAssembler} from '@app/iam/infrastructure/profiles-assembler';

const profilesApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderProfileEndpointPath}`;

export class ProfilesApiEndpoint extends BaseApiEndpoint<Profile, ProfileResource, ProfileResponse, ProfilesAssembler> {
  constructor(http: HttpClient) {
    super( http, profilesApiEndpointUrl, new ProfilesAssembler());
  }
}
