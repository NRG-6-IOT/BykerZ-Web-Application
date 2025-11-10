import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Profile} from '../domain/model/profile.entity';
import {ProfileResource, ProfileResponse} from '@app/iam/infrastructure/profiles-response';

export class ProfilesAssembler implements BaseAssembler<Profile, ProfileResource, ProfileResponse> {
  toEntityFromResource(resource: ProfileResource): Profile {
    return new Profile({
      id: resource.id,
      firstName: resource.firstName,
      lastName: resource.lastName,
      emailAddress: resource.emailAddress,
      photoUrl: resource.photoUrl
    });
  }

  toResourceFromEntity(entity: Profile): ProfileResource {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      emailAddress: entity.emailAddress,
      photoUrl: entity.photoUrl
    } as ProfileResource
  }

  toEntitiesFromResponse(response: ProfileResponse): Profile[] {
    return response.profile.map(resource => this.toEntityFromResource(resource as ProfileResource));
  }
}
