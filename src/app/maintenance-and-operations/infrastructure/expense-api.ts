import {BaseApi} from '@app/shared/infrastructure/base-api';
import {Injectable} from '@angular/core';
import {ExpenseApiEndpoint} from '@app/maintenance-and-operations/infrastructure/expense-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {ExpenseAssembler} from '@app/maintenance-and-operations/infrastructure/expense-assembler';
import {map, Observable} from 'rxjs';
import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';
import {ExpenseResource, ExpensesResponse} from '@app/maintenance-and-operations/infrastructure/expense-response';

@Injectable({providedIn: 'root'})
export class ExpenseApi extends BaseApi {
  private readonly expenseEndpoint: ExpenseApiEndpoint;
  private readonly httpClient: HttpClient;
  private readonly assembler = new ExpenseAssembler();

  constructor(http: HttpClient) {
    super();
    this.httpClient = http;
    this.expenseEndpoint = new ExpenseApiEndpoint(http);
  }

  /**
   * Creates a new expense for a user
   * @param userId - The ID of the user
   * @param expense - The expense to create (without ID)
   * @returns Observable of the created Expense entity
   */
  createExpense(userId: number, expense: Omit<Expense, 'id'>): Observable<Expense> {
    const resource = this.assembler.toResourceFromEntity(expense as Expense);
    const { id, ...resourceWithoutId } = resource;

    return this.expenseEndpoint.createExpenseForUser(userId, resourceWithoutId).pipe(
      map(createdResource => this.assembler.toEntityFromResource(createdResource))
    );
  }

  /**
   * Gets all expenses
   * @returns Observable of array of Expense entities
   */
  getAllExpenses(): Observable<Expense[]> {
    return this.expenseEndpoint.getAllExpenses().pipe(
      map(response =>
        Array.isArray(response)
          ? response.map(resource => this.assembler.toEntityFromResource(resource))
          : this.assembler.toEntitiesFromResponse(response as ExpensesResponse)
      )
    );
  }

  /**
   * Gets an expense by ID
   * @param expenseId - The ID of the expense
   * @returns Observable of the Expense entity
   */
  getExpenseById(expenseId: number): Observable<Expense> {
    return this.expenseEndpoint.getExpenseById(expenseId).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  /**
   * Deletes an expense by ID
   * @param expenseId - The ID of the expense to delete
   * @returns Observable of void
   */
  deleteExpense(expenseId: number): Observable<void> {
    return this.expenseEndpoint.deleteExpense(expenseId);
  }
}


