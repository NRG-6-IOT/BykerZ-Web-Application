import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';
import {ExpenseApi} from '@app/maintenance-and-operations/infrastructure/expense-api';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private expenseApi: ExpenseApi) { }

  createExpense(userId: number, expense: Omit<Expense, 'id'>): Observable<Expense> {
    return this.expenseApi.createExpense(userId, expense);
  }

  getAllExpenses(): Observable<Expense[]> {
    return this.expenseApi.getAllExpenses();
  }

  getExpenseById(expenseId: number): Observable<Expense> {
    return this.expenseApi.getExpenseById(expenseId);
  }

  deleteExpense(expenseId: number): Observable<any> {
    return this.expenseApi.deleteExpense(expenseId);
  }
}


