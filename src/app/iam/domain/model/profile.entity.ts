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
  set id(value: number) { this._id = value; }
  get firstName(): string { return this._firstName; }
  set firstName(value: string) { this._firstName = value; }
  get lastName(): string { return this._lastName; }
  set lastName(value: string) { this._lastName = value; }
  get emailAddress(): string { return this._emailAddress; }
  set emailAddress(value: string) { this._emailAddress = value; }
  get photoUrl(): string { return this._photoUrl; }
  set photoUrl(value: string) { this._photoUrl = value; }
}
