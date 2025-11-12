import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';
import {ExpenseResource} from '@app/maintenance-and-operations/infrastructure/expense-response';

export interface MaintenanceResource extends BaseResource {
  id: number;
  details: string;
  vehicleId: number;
  dateOfService: string;
  location: string;
  description: string;
  state: string;
  expense: ExpenseResource | null;
  mechanicId: number;
}

export interface MaintenanceResponse extends BaseResponse {
  maintenance: MaintenanceResource;
}

export interface MaintenancesResponse extends BaseResponse {
  maintenances: MaintenanceResource[];
}

