import {BaseEntity} from '@app/shared/domain/model/base-entity';

export class Owner implements BaseEntity {
  private _id: number;
  private _completeName: string;

  /**
   * Constructor
   * @param owner - Object containing owner properties
   * @param owner.ownerId - Owner ID from API
   * @param owner.profileId - Profile ID from API
   *
   * @example
   * const owner = new Owner({ ownerId: 1, profileId: 2 });
   */
  constructor(owner: { ownerId: number; completeName: string }) {
    this._id = owner.ownerId;
    this._completeName = owner.completeName;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get completeName(): string {
    return this._completeName;
  }
  set completeName(value: string) {
    this._completeName = value;
  }
}
