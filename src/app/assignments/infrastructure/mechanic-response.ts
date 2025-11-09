import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';

export interface MechanicResource extends BaseResource {
  mechanicId: number;
  completeName: string;
}

export interface MechanicResponse extends BaseResponse {
  mechanic: MechanicResource;
}
