import { Owner } from './owner.entity';
import { Mechanic } from './mechanic.entity';
import {BaseEntity} from '@app/shared/domain/model/base-entity';

export class Assignment implements BaseEntity {
  private _id: number;
  private _owner: Owner | null;
  private _mechanic: Mechanic | null;
  private _type: string;
  private _status: string;
  private _assignmentCode: string;
  private _createdAt: string;

  /**
   * Constructor
   * @param assignment - Object containing assignment properties as returned by the API
   * @param assignment.id - Assignment ID
   * @param assignment.owner - Owner object or null
   * @param assignment.mechanic - Mechanic object or null
   * @param assignment.type - Assignment type
   * @param assignment.status - Assignment status
   * @param assignment.assignmentCode - Assignment code
   * @param assignment.createdAt - Creation timestamp (string)
   *
   * @example
   * const a = new Assignment({
   *   id: 7,
   *   owner: null,
   *   mechanic: { mechanicId: 1, completeName: 'a joe' },
   *   type: 'UNCATEGORIZED',
   *   status: 'PENDING',
   *   assignmentCode: 'DCHBGTCWF',
   *   createdAt: '2025-11-08 11:24:03.514'
   * });
   */
  constructor(assignment: any) {
    console.log('Assignment constructor called with:', assignment);

    this._id = assignment.id;
    this._owner = assignment.owner ? new Owner(assignment.owner) : null;
    this._mechanic = assignment.mechanic ? new Mechanic(assignment.mechanic) : null;
    this._type = assignment.type;
    this._status = assignment.status;
    this._assignmentCode = assignment.assignmentCode;
    this._createdAt = assignment.createdAt;

    console.log('Created assignment with owner:', this._owner);
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get owner(): Owner | null {
    return this._owner;
  }
  set owner(value: Owner | null) {
    this._owner = value;
  }

  get mechanic(): Mechanic | null {
    return this._mechanic;
  }
  set mechanic(value: Mechanic | null) {
    this._mechanic = value;
  }

  get type(): string {
    return this._type;
  }
  set type(value: string) {
    this._type = value;
  }

  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }

  get assignmentCode(): string {
    return this._assignmentCode;
  }
  set assignmentCode(value: string) {
    this._assignmentCode = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }
  set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Optional: helper to get createdAt as Date
   */
  get createdAtDate(): Date {
    return new Date(this._createdAt);
  }
}
