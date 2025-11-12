import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';

export class Maintenance {
  id: number;
  details: string;
  vehicleId: number;
  dateOfService: string;
  location: string;
  description: string;
  state: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  expense: Expense | null;
  mechanicId: number;

  constructor(
    id: number,
    details: string,
    vehicleId: number,
    dateOfService: string,
    location: string,
    description: string,
    state: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    expense: Expense | null,
    mechanicId: number
  ) {
    this.id = id;
    this.details = details;
    this.vehicleId = vehicleId;
    this.dateOfService = dateOfService;
    this.location = location;
    this.description = description;
    this.state = state;
    this.expense = expense;
    this.mechanicId = mechanicId;
  }

}
