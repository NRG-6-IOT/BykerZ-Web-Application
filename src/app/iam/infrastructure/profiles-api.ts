import {Injectable} from '@angular/core';
import {BaseApi} from '@app/shared/infrastructure/base-api';
import {ProfilesApiEndpoint} from '@app/iam/infrastructure/profiles-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {ProfilesAssembler} from '@app/iam/infrastructure/profiles-assembler';
import {map, Observable} from 'rxjs';
import {Profile} from '@app/iam/domain/model/profile.entity';
import {ProfileResource} from '@app/iam/infrastructure/profiles-response';

@Injectable({providedIn: 'root'})
export class ProfilesApi extends BaseApi {
  private readonly profilesApiEndpoint: ProfilesApiEndpoint;
  private readonly httpClient: HttpClient;
  private readonly assembler = new ProfilesAssembler();

  constructor(http: HttpClient) {
    super();
    this.httpClient = http;
    this.profilesApiEndpoint = new ProfilesApiEndpoint(http);
  }

  // Only for login
  getProfileByUserId(userId: number): Observable<Profile> {
    return this.profilesApiEndpoint.getByUserId(userId).pipe(
      map(response => {
        if (Array.isArray(response)) {
          // this should not happen but, just in case, you know? like what if an array of profiles was accidentally (or purposefully) returned? that would be funny... actually, that wouldn't be funny at all. it shouldn't return more than one profile, but... ok i'll shut up.
          throw new Error('Expected a single ProfileResource, but received an array.');
        }
        return this.assembler.toEntityFromResource(response as ProfileResource);
      })
    );
  }
}
