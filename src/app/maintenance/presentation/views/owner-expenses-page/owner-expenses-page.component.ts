import {Component, inject, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {
  CreateExpenseDialogComponent
} from '@app/maintenance/presentation/components/create-expense-dialog/create-expense-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ExpenseService} from '@app/maintenance/infrastructure/expense.service';
import {Expense} from '@app/maintenance/domain/model/expense.entity';
import {CommonModule} from '@angular/common';
import {UserService} from '@app/iam/services/user.service';
import {AuthenticationService} from '@app/iam/services/authentication.service';

@Component({
  selector: 'app-owner-expenses-page',
  imports: [
    MatIconModule,
    CommonModule
  ],
  template: `
    <div class="w-full h-full p-10 relative">
      <h1 class="text-3xl font-bold mb-4">Expenses</h1>
      <div class="flex flex-col gap-4 mb-4">
        @if (expenses.length === 0) {
          <div class="text-center text-gray-500 py-8">
            No expenses found. Click the + button to create one.
          </div>
        }
        @for (expense of expenses; track expense.id) {
          <div class="bg-[#FF6B35] p-4 rounded-2xl flex flex-row-reverse [&:has(.icon-container:hover)]:bg-[#ff9169] transition-colors">
            <div (click)="navigateToDetails(expense.id)" class="flex justify-center items-center px-10 icon-container group cursor-pointer" style="color: white">
              <mat-icon class="scale-200 group-hover:scale-225 transition-transform ease-in-out" fontIcon="arrow_forward_ios"></mat-icon>
            </div>
            <div class="flex justify-center items-center px-10">
              <button
                (click)="deleteExpense(expense.id)"
                class="rounded-2xl px-6 py-1 bg-[#380800] text-white transition-colors hover:bg-[#613930] ">
                Delete
              </button>
            </div>

            <div class="bg-white p-2 rounded-xl grid grid-cols-3 flex-1 min-h-25 ">
              <div class="border-r-black border-r flex justify-center items-center">{{expense.name}}</div>
              <div class="border-r-black border-r flex justify-center items-center">{{expense.expenseType}}</div>
              <div class="flex justify-center items-center">{{expense.finalPrice}}</div>
            </div>

          </div>
        }
      </div>
      <button
        (click)="openDialog()"
        class="bg-[#FF6B35] text-white w-16 h-16 rounded-2xl flex justify-center items-center text-4xl font-bold absolute bottom-20 right-20 hover:bg-[#ff9169] transition-colors cursor-pointer">
        +
      </button>
    </div>
  `,
  styles: ``,
})
export class OwnerExpensesPageComponent implements OnInit {
  expenses: Expense[] = [];

  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly expenseService = inject(ExpenseService);
  readonly userService = inject(UserService);
  readonly authService = inject(AuthenticationService);

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
      },
      error: (error) => {
        console.error('Error loading expenses:', error);
      }
    });
  }

  navigateToDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }

  deleteExpense(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(expenseId).subscribe({
        next: () => {
          console.log('Expense deleted successfully');
          this.loadExpenses(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting expense:', error);
        }
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateExpenseDialogComponent, {
      width: 'auto',
      maxWidth: 'none',
      disableClose: false,
      panelClass: 'custom-expense-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Expense created:', result);
        // Get the current user ID to create the expense
        this.authService.currentUserId.subscribe(userId => {
          if (userId) {
            // Ensure expenseType is always PERSONAL
            const expenseToCreate = {
              ...result,
              expenseType: 'PERSONAL'
            };

            this.expenseService.createExpense(userId, expenseToCreate).subscribe({
              next: (createdExpense) => {
                console.log('Expense created successfully:', createdExpense);
                this.loadExpenses(); // Reload the list
              },
              error: (error) => {
                console.error('Error creating expense:', error);
              }
            });
          }
        });
      }
    });
  }

}
