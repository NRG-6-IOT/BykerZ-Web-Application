import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';

export interface OwnerResource extends BaseResource {
  ownerId: number;
  profileId?: number;
  completeName?: string;
}

export interface OwnerResponse extends BaseResponse {
  owner: OwnerResource;
}
