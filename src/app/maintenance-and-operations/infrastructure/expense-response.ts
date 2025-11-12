import {BaseResource, BaseResponse} from '@app/shared/infrastructure/base-response';

export interface ExpenseItemResource {
  id: number;
  name: string;
  amount: number;
  unitPrice: number;
  totalPrice: number;
  itemType: string;
}

export interface ExpenseResource extends BaseResource {
  id: number;
  name: string;
  finalPrice: number;
  expenseType: string;
  items: ExpenseItemResource[];
}

export interface ExpenseResponse extends BaseResponse {
  expense: ExpenseResource;
}

export interface ExpensesResponse extends BaseResponse {
  expenses: ExpenseResource[];
}
