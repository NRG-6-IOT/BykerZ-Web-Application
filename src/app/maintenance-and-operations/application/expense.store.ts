import {computed, inject, Injectable, signal, Signal} from '@angular/core';
import {Expense} from '@app/maintenance-and-operations/domain/model/expense.entity';
import {ExpenseApi} from '@app/maintenance-and-operations/infrastructure/expense-api';
import {retry} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ExpenseStore {
  // State signals
  private expensesSignal = signal<Expense[]>([]);
  private selectedExpenseSignal = signal<Expense | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  // Public readonly signals
  readonly expenses = computed(() => this.expensesSignal());
  readonly selectedExpense = computed(() => this.selectedExpenseSignal());
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  // Dependency injection
  private expenseApi = inject(ExpenseApi);

  /**
   * Loads all expenses
   */
  loadAllExpenses(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.expenseApi.getAllExpenses().pipe(retry(2)).subscribe({
      next: expenses => {
        this.expensesSignal.set(expenses);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load expenses'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads a specific expense by ID
   * @param expenseId - The ID of the expense to load
   */
  loadExpenseById(expenseId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.expenseApi.getExpenseById(expenseId).pipe(retry(2)).subscribe({
      next: expense => {
        this.selectedExpenseSignal.set(expense);

        // Also update in the expenses array if it exists
        const currentExpenses = this.expensesSignal();
        const existingIndex = currentExpenses.findIndex(e => e.id === expense.id);

        if (existingIndex >= 0) {
          const updatedExpenses = [...currentExpenses];
          updatedExpenses[existingIndex] = expense;
          this.expensesSignal.set(updatedExpenses);
        } else {
          this.expensesSignal.update(expenses => [...expenses, expense]);
        }

        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load expense'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Creates a new expense for a user
   * @param userId - The ID of the user creating the expense
   * @param expense - The expense to create (without ID)
   */
  createExpense(userId: number, expense: Omit<Expense, 'id'>): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.expenseApi.createExpense(userId, expense).pipe(retry(2)).subscribe({
      next: createdExpense => {
        this.expensesSignal.update(expenses => [createdExpense, ...expenses]);
        this.selectedExpenseSignal.set(createdExpense);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create expense'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes an expense by ID
   * @param expenseId - The ID of the expense to delete
   */
  deleteExpense(expenseId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.expenseApi.deleteExpense(expenseId).pipe(retry(1)).subscribe({
      next: () => {
        this.expensesSignal.update(expenses => expenses.filter(e => e.id !== expenseId));

        // Clear selected expense if it was deleted
        if (this.selectedExpenseSignal()?.id === expenseId) {
          this.selectedExpenseSignal.set(null);
        }

        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete expense'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets an expense by ID from the current state
   * @param id - The ID of the expense
   * @returns A computed signal with the expense or undefined
   */
  getExpenseById(id: number | null | undefined): Signal<Expense | undefined> {
    return computed(() => id ? this.expensesSignal().find(e => e.id === id) : undefined);
  }

  /**
   * Clears the selected expense
   */
  clearSelectedExpense(): void {
    this.selectedExpenseSignal.set(null);
  }

  /**
   * Clears any error message
   */
  clearError(): void {
    this.errorSignal.set(null);
  }

  /**
   * Resets the entire store state (useful for sign-out)
   */
  reset(): void {
    this.expensesSignal.set([]);
    this.selectedExpenseSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }

  /**
   * Formats error messages for user-friendly display
   * @param error - The error object
   * @param fallback - Fallback message if error cannot be parsed
   * @returns Formatted error message
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}

