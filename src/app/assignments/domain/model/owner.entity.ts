import {BaseEntity} from '@app/shared/domain/model/base-entity';

export class Owner implements BaseEntity {
  private _id: number;
  private _completeName: string;

  /**
   * Constructor
   * @param owner - Object containing owner properties
   * @param owner.ownerId - Owner ID from API
   * @param owner.completeName - Complete name from API
   *
   * @example
   * const owner = new Owner({ ownerId: 1, completeName: "John Doe" });
   */
  constructor(owner: any) {
    // Handle both ownerId and id properties for flexibility
    this._id = owner.ownerId || owner.id || 0;
    this._completeName = owner.completeName || owner.name || '';

    console.log('Owner constructor called with:', owner);
    console.log('Mapped owner ID:', this._id, 'name:', this._completeName);
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
