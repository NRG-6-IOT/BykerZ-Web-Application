export class Subscription {
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
export class Owner {
  id: number;
  name: string;
  constructor(
    id: number,
    name: string
  ) {
    this.id = id;
    this.name = name;
  }
}
