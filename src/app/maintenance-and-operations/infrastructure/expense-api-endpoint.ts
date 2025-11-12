import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '@app/shared/infrastructure/base-api-endpoint';
import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';
import {ExpenseResource, ExpensesResponse} from '@app/maintenance-and-operations/infrastructure/expense-response';
import {ExpenseAssembler} from '@app/maintenance-and-operations/infrastructure/expense-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable} from 'rxjs';

const expenseEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderExpenseEndpointPath}`;

export class ExpenseApiEndpoint extends BaseApiEndpoint<Expense, ExpenseResource, ExpensesResponse, ExpenseAssembler> {
  constructor(http: HttpClient) {
    super(http, expenseEndpointUrl, new ExpenseAssembler());
  }

  /**
   * Low-level HTTP call for: POST /api/v1/expense/{userId}
   * Creates a new expense for a user
   */
  createExpenseForUser(userId: number, expenseResource: Omit<ExpenseResource, 'id'>): Observable<ExpenseResource> {
    const url = `${this.endpointUrl}/${userId}`;
    return this.http.post<ExpenseResource>(url, expenseResource).pipe(
      catchError(this.handleError(`Failed to create expense for userId=${userId}`))
    );
  }

  /**
   * Low-level HTTP call for: GET /api/v1/expense
   * Gets all expenses
   */
  getAllExpenses(): Observable<ExpensesResponse | ExpenseResource[]> {
    return this.http.get<ExpensesResponse | ExpenseResource[]>(this.endpointUrl).pipe(
      catchError(this.handleError('Failed to fetch all expenses'))
    );
  }

  /**
   * Low-level HTTP call for: GET /api/v1/expense/{expenseId}
   * Gets an expense by ID
   */
  getExpenseById(expenseId: number): Observable<ExpenseResource> {
    const url = `${this.endpointUrl}/${expenseId}`;
    return this.http.get<ExpenseResource>(url).pipe(
      catchError(this.handleError(`Failed to fetch expense with id=${expenseId}`))
    );
  }

  /**
   * Low-level HTTP call for: DELETE /api/v1/expense/{expenseId}
   * Deletes an expense by ID
   */
  deleteExpense(expenseId: number): Observable<void> {
    const url = `${this.endpointUrl}/${expenseId}`;
    return this.http.delete<void>(url).pipe(
      catchError(this.handleError(`Failed to delete expense with id=${expenseId}`))
    );
  }
}

