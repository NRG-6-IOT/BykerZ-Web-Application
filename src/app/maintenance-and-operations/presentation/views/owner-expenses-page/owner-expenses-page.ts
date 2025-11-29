import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CreateExpenseDialog} from '@app/maintenance-and-operations/presentation/components/create-expense-dialog/create-expense-dialog';
import {MatDialog} from '@angular/material/dialog';
import {NavigationEnd, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-owner-expenses-page',
  imports: [
    MatIconModule,
    CommonModule
  ],
  template: `
    <div class="screen p-10 relative">
      <div class="flex justify-between mb-8">
        <h1 class="text-3xl font-bold ">Expenses</h1>

        <button
          (click)="openDialog()"
          [disabled]="expenseStore.loading()"
          class="bg-[#FF6B35] text-white px-4 py-2 rounded-2xl flex justify-center items-center text-lg font-bold hover:bg-[#ff9169] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          Create Expense
        </button>
      </div>

      <!-- Loading State -->
      @if (expenseStore.loading()) {
        <div class="text-center text-gray-500 py-8">
          Loading expenses...
        </div>
      }

      <!-- Error State -->
      @if (expenseStore.error()) {
        <div class="text-center text-red-500 py-8">
          {{expenseStore.error()}}
        </div>
      }

      <!-- Expenses List -->
      <div class="flex flex-col gap-4 mb-4">
        @if (!expenseStore.loading() && expenseStore.expenses().length === 0) {
          <div class="text-center text-gray-500 py-8">
            No expenses found. Click the button to create one.
          </div>
        }
        @for (expense of expenseStore.expenses(); track expense.id) {
          <div class="bg-[#FF6B35] p-4 rounded-2xl flex flex-row-reverse [&:has(.icon-container:hover)]:bg-[#ff9169] transition-colors">
            <div (click)="navigateToDetails(expense.id)" class="flex justify-center items-center px-10 icon-container group cursor-pointer" style="color: white">
              <mat-icon class="scale-200 group-hover:scale-225 transition-transform ease-in-out" fontIcon="arrow_forward_ios"></mat-icon>
            </div>
            <div class="flex justify-center items-center px-10">
              <button
                (click)="deleteExpense(expense.id)"
                [disabled]="expenseStore.loading()"
                class="rounded-2xl px-6 py-1 bg-[#380800] text-white transition-colors hover:bg-[#613930] disabled:opacity-50 disabled:cursor-not-allowed">
                Delete
              </button>
            </div>

            <div class="bg-white p-2 rounded-xl grid grid-cols-3 flex-1 min-h-25">
              <div class="border-r-black border-r flex justify-center items-center">{{expense.name}}</div>
              <div class="border-r-black border-r flex justify-center items-center">{{expense.expenseType}}</div>
              <div class="flex justify-center items-center">{{expense.finalPrice}}</div>
            </div>
          </div>
        }
      </div>


    </div>
  `,
  styles: ``,
})
export class OwnerExpensesPage implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly expenseStore = inject(ExpenseStore);
  readonly authService = inject(AuthenticationService);

  private routerSubscription?: Subscription;

  ngOnInit(): void {
    this.loadExpenses();

    // Subscribe to router events to reload expenses when navigating back
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: NavigationEnd) => event.url === '/expenses' || event.url === '/expenses/')
    ).subscribe(() => {
      this.loadExpenses();
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  loadExpenses(): void {
    this.expenseStore.loadAllExpenses();
  }

  navigateToDetails(expenseId: number): void {
    this.router.navigate(['/expenses', expenseId]);
  }

  deleteExpense(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseStore.deleteExpense(expenseId);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateExpenseDialog, {
      width: 'auto',
      maxWidth: 'none',
      disableClose: false,
      panelClass: 'custom-expense-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Get the owner ID to create the expense
        this.authService.getRoleSpecificUserId().subscribe(ownerId => {
          if (ownerId) {
            // Ensure expenseType is always PERSONAL
            const expenseToCreate = {
              ...result,
              expenseType: 'PERSONAL'
            };

            this.expenseStore.createExpense(ownerId, expenseToCreate);
          }
        });
      }
    });
  }

}
