import {Expense} from '@app/maintenance/domain/model/expense.entity';


export interface Maintenance {
  id: number;
  details: string;
  vehicleId: number;
  dateOfService: string;
  location: string;
  description: string;
  state: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  expense: Expense | null;
  mechanicId: number;
}

