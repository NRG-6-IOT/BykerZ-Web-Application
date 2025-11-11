import { ExpenseItem } from './expense-item.entity';

export interface Expense {
  id: number;
  name: string;
  finalPrice: number;
  expenseType: string;
  items: ExpenseItem[];
}

