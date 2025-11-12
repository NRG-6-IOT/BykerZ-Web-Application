import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {MaintenanceResource, MaintenancesResponse} from '@app/maintenance-and-operations/infrastructure/maintenance-response';
import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';
import {ExpenseAssembler} from '@app/maintenance-and-operations/infrastructure/expense-assembler';
import {ExpenseResource} from '@app/maintenance-and-operations/infrastructure/expense-response';

export class MaintenanceAssembler implements BaseAssembler<Maintenance, MaintenanceResource, MaintenancesResponse> {
  private expenseAssembler = new ExpenseAssembler();

  toEntitiesFromResponse(response: MaintenancesResponse): Maintenance[] {
    if (!response || !response.maintenances) return [];
    return response.maintenances.map(res => this.toEntityFromResource(res as MaintenanceResource));
  }

  toEntityFromResource(resource: MaintenanceResource): Maintenance {
    const expense = resource.expense
      ? this.expenseAssembler.toEntityFromResource(resource.expense)
      : null;

    return new Maintenance(
      resource.id,
      resource.details,
      resource.vehicleId,
      resource.dateOfService,
      resource.location,
      resource.description,
      resource.state as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
      expense,
      resource.mechanicId
    );
  }

  toResourceFromEntity(entity: Maintenance): MaintenanceResource {
    const expenseResource = entity.expense
      ? this.expenseAssembler.toResourceFromEntity(entity.expense)
      : null;

    return {
      id: entity.id,
      details: entity.details,
      vehicleId: entity.vehicleId,
      dateOfService: entity.dateOfService,
      location: entity.location,
      description: entity.description,
      state: entity.state,
      expense: expenseResource,
      mechanicId: entity.mechanicId
    };
  }
}
