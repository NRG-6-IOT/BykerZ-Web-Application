export class Expense {
  expenseId: number;
  expenseName: string;
  expenseAmount: number;
  expenseUnitPrice: number;
  expenseTotalPrice: number;

  constructor(expenseId: number, expenseName: string, expenseAmount: number, expenseUnitPrice: number, expenseTotalPrice: number) {
    this.expenseId = expenseId;
    this.expenseName = expenseName;
    this.expenseAmount = expenseAmount;
    this.expenseUnitPrice = expenseUnitPrice;
    this.expenseTotalPrice = expenseTotalPrice;
  }
}
