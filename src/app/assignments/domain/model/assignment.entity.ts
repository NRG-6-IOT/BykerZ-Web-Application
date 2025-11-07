import {Owner} from '@app/assignments/domain/model/owner.entity';

export class Assignment {
  id: number;
  linkDetails: string;
  owner: Owner;
  numberVehicles: number;
  constructor(
    id: number,
    linkDetails: string,
    owner: Owner,
    numberVehicles: number
  ) {
    this.id = id;
    this.linkDetails = linkDetails;
    this.owner = owner;
    this.numberVehicles = numberVehicles;
  }
}
