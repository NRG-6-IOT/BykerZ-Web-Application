import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CreateExpenseDialog} from '@app/maintenance-and-operations/presentation/components/create-expense-dialog/create-expense-dialog';
import {MatDialog} from '@angular/material/dialog';
import {NavigationEnd, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {filter, Subscription} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-owner-expenses-page',
  standalone: true,
  imports: [MatIconModule, CommonModule, TranslateModule],
  template: `
    <div class="page">
      <div class="header-action-row">
        <h1 class="page-title">{{ 'navbar.owner.expenses' | translate }}</h1>
        <button class="btn-create" (click)="openDialog()" [disabled]="expenseStore.loading()">
          <span class="icon">+</span> {{ 'expenses.createButton' | translate }}
        </button>
      </div>

      <div *ngIf="expenseStore.loading()" class="loading-container">
        <div class="spinner"></div>
      </div>

      <div *ngIf="expenseStore.error()" class="error-msg">
        {{expenseStore.error()}}
      </div>

      <div class="expenses-grid" *ngIf="!expenseStore.loading()">
        <div class="empty-state" *ngIf="expenseStore.expenses().length === 0">
          <p>{{ 'expenses.emptyState' | translate }}</p>
        </div>

        <div class="expense-card" *ngFor="let expense of expenseStore.expenses(); trackBy: trackById">
          <div class="expense-main" (click)="navigateToDetails(expense.id)">
            <div class="expense-icon">💰</div>
            <div class="expense-info">
              <h3 class="expense-name">{{expense.name}}</h3>
              <span class="expense-type">{{expense.expenseType}}</span>
            </div>
            <div class="expense-price">
              {{expense.finalPrice | number:'1.2-2'}}
            </div>
            <mat-icon class="arrow-icon">chevron_right</mat-icon>
          </div>

          <div class="expense-actions">
            <button class="btn-delete" (click)="deleteExpense(expense.id)" [disabled]="expenseStore.loading()">
              <mat-icon fontIcon="delete" style="font-size: 1.2rem; height: 1.2rem; width: 1.2rem;"></mat-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1000px; margin: 0 auto; padding: 2rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .header-action-row {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2.5rem;
    }

    .page-title {
      font-size: 2.5rem; font-weight: 700; margin: 0;
      line-height: 1.1;
      display: block;
      height: auto;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      background-clip: text;
      color: transparent;
      padding-block: 0.25em;
      display: inline-block;
      line-height: normal;
    }

    .btn-create {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; border: none; padding: 0.75rem 1.5rem;
      border-radius: 12px; font-weight: 600; font-size: 1rem;
      cursor: pointer; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;
    }
    .btn-create:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4); }

    .expenses-grid { display: flex; flex-direction: column; gap: 1rem; }

    .expense-card {
      background: white; border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      display: flex; align-items: stretch; overflow: hidden;
      border: 1px solid transparent;
    }
    .expense-card:hover {
      transform: translateY(-2px); border-color: #ff6b35;
      box-shadow: 0 8px 20px rgba(255, 107, 53, 0.1);
    }

    .expense-main {
      flex: 1; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; cursor: pointer;
    }

    .expense-icon {
      width: 48px; height: 48px; background: #fff5f0;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    }

    .expense-info { flex: 1; }
    .expense-name { margin: 0; font-size: 1.1rem; font-weight: 600; color: #333; }
    .expense-type { font-size: 0.8rem; color: #999; text-transform: uppercase; font-weight: 600; }

    .expense-price { font-size: 1.25rem; font-weight: 700; color: #ff6b35; }

    .arrow-icon { color: #ccc; transition: transform 0.2s; }
    .expense-main:hover .arrow-icon { transform: translateX(4px); color: #ff6b35; }

    .expense-actions {
      background: #f9f9f9; width: 60px; display: flex;
      align-items: center; justify-content: center;
      border-left: 1px solid #eee;
    }

    .btn-delete {
      background: transparent; border: none; color: #999;
      cursor: pointer; padding: 0.5rem; border-radius: 50%;
      transition: all 0.2s;
    }
    .btn-delete:hover { background: #fee; color: #d32f2f; }

    .loading-container { display: flex; justify-content: center; padding: 2rem; }
    .spinner {
      width: 30px; height: 30px; border: 3px solid #eee; border-top-color: #ff6b35;
      border-radius: 50%; animation: spin 1s infinite linear;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .empty-state { text-align: center; color: #999; padding: 2rem; }
  `]
})
export class OwnerExpensesPage implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);
  readonly expenseStore = inject(ExpenseStore);
  readonly authService = inject(AuthenticationService);

  private routerSubscription?: Subscription;

  ngOnInit(): void {
    this.loadExpenses();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd && event.url.startsWith('/expenses'))
    ).subscribe(() => this.loadExpenses());
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  loadExpenses(): void { this.expenseStore.loadAllExpenses(); }

  navigateToDetails(id: number): void { this.router.navigate(['/expenses', id]); }

  trackById(index: number, item: any): number { return item.id; }

  deleteExpense(id: number): void {
    if (confirm('Are you sure?')) this.expenseStore.deleteExpense(id);
  }

  openDialog(): void {
    this.dialog.open(CreateExpenseDialog, {
      width: 'auto', maxWidth: 'none', panelClass: 'custom-expense-dialog'
    }).afterClosed().subscribe(result => {
      if (result) {
        this.authService.getRoleSpecificUserId().subscribe(ownerId => {
          if (ownerId) this.expenseStore.createExpense(ownerId, { ...result, expenseType: 'PERSONAL' });
        });
      }
    });
  }
}
