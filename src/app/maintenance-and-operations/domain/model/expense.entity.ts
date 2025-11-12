import {ExpenseItem} from '@app/maintenance-and-operations/domain/model/expense-item.entity';
import {BaseEntity} from '@app/shared/domain/model/base-entity';

export class Expense implements BaseEntity {
  id: number;
  name: string;
  finalPrice: number;
  expenseType: string;
  items: ExpenseItem[];

  constructor(
    id: number,
    name: string,
    finalPrice: number,
    expenseType: string,
    items: ExpenseItem[]
  ) {
    this.id = id;
    this.name = name;
    this.finalPrice = finalPrice;
    this.expenseType = expenseType;
    this.items = items;
  }

}
