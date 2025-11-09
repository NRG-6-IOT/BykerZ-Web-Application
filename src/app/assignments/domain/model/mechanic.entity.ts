import {BaseEntity} from '@app/shared/domain/model/base-entity';

export class Mechanic implements BaseEntity {
  private _id: number;
  private _completeName: string;

  /**
   * Constructor
   * @param mechanic - Object containing mechanic properties
   * @param mechanic.mechanicId - Mechanic ID from API
   * @param mechanic.completeName - Mechanic full name from API
   *
   * @example
   * const mech = new Mechanic({ mechanicId: 1, completeName: 'a joe' });
   */
  constructor(mechanic: { mechanicId: number; completeName: string }) {
    this._id = mechanic.mechanicId;
    this._completeName = mechanic.completeName;
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
