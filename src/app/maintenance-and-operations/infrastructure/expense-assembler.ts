import {BaseAssembler} from '@app/shared/infrastructure/base-assembler';
import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';
import {ExpenseItem} from '@app/maintenance-and-operations/domain/model/expense-item.entity';
import {ExpenseResource, ExpensesResponse, ExpenseItemResource} from '@app/maintenance-and-operations/infrastructure/expense-response';

export class ExpenseAssembler implements BaseAssembler<Expense, ExpenseResource, ExpensesResponse> {

  toEntitiesFromResponse(response: ExpensesResponse): Expense[] {
    if (!response || !response.expenses) return [];
    return response.expenses.map(res => this.toEntityFromResource(res as ExpenseResource));
  }

  toEntityFromResource(resource: ExpenseResource): Expense {
    const items = resource.items ? resource.items.map(item => this.toExpenseItemFromResource(item)) : [];

    return new Expense(
      resource.id,
      resource.name,
      resource.finalPrice,
      resource.expenseType,
      items
    );
  }

  toResourceFromEntity(entity: Expense): ExpenseResource {
    return {
      id: entity.id,
      name: entity.name,
      finalPrice: entity.finalPrice,
      expenseType: entity.expenseType,
      items: entity.items ? entity.items.map(item => this.toExpenseItemResourceFromEntity(item)) : []
    };
  }

  private toExpenseItemFromResource(resource: ExpenseItemResource): ExpenseItem {
    return new ExpenseItem(
      resource.id,
      resource.name,
      resource.amount,
      resource.unitPrice,
      resource.totalPrice,
      resource.itemType
    );
  }

  private toExpenseItemResourceFromEntity(entity: ExpenseItem): ExpenseItemResource {
    return {
      id: entity.id,
      name: entity.name,
      amount: entity.amount,
      unitPrice: entity.unitPrice,
      totalPrice: entity.totalPrice,
      itemType: entity.itemType
    };
  }
}

