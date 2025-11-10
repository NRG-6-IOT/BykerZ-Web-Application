import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';

export interface ProfileResource extends BaseResource {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  photoUrl: string;
}
export interface ProfileResponse extends BaseResponse {
  profile: ProfileResource[];
}
