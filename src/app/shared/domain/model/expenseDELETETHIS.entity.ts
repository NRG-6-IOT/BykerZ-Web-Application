export class Expense {
  expenseId: number;
  expenseName: string;
  expenseAmount: number;
  expenseUnitPrice: number;
  expenseTotalPrice: number;
  expenseType: string;

  constructor(
    expenseId: number,
    expenseName: string,
    expenseAmount: number,
    expenseUnitPrice: number,
    expenseTotalPrice: number,
    expenseType: string,
  ) {
    this.expenseId = expenseId;
    this.expenseName = expenseName;
    this.expenseAmount = expenseAmount;
    this.expenseUnitPrice = expenseUnitPrice;
    this.expenseTotalPrice = expenseTotalPrice;
    this.expenseType = expenseType;
  }
}
