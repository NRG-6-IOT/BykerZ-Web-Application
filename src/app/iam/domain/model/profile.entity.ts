import {BaseEntity} from '@app/shared/domain/model/base-entity';

export class Profile implements BaseEntity {
  private _id: number;
  private _firstName: string;
  private _lastName: string
  private _emailAddress: string;
  private _photoUrl: string;

  constructor(profile: {id: number, firstName: string, lastName: string, emailAddress: string, photoUrl: string}) {
    this._id = profile.id;
    this._firstName = profile.firstName;
    this._lastName = profile.lastName;
    this._emailAddress = profile.emailAddress;
    this._photoUrl = profile.photoUrl;
  }

  get id(): number { return this._id; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get emailAddress(): string { return this._emailAddress; }
  get photoUrl(): string { return this._photoUrl; }
}
