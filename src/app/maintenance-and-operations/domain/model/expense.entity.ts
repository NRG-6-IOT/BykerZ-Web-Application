import {ExpenseItem} from '@app/maintenance-and-operations/domain/model/expense-item.entity';

export class Expense {
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
