import { Component } from '@angular/core';
import { Expense } from '@app/shared/domain/model/expenseDELETETHIS.entity'; // Asegúrate de que la ruta sea correcta
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-expenses-page',
  standalone: true,
  imports: [MatIconModule, CommonModule, TranslateModule],
  template: `
    <div class="page">
      <div class="header">
        <h1 class="page-title">Expenses</h1>
        <button class="btn-add">
          <span>+</span> Add Expense
        </button>
      </div>

      <div class="content">
        <div class="expenses-grid">
          @for (expense of expenses; track expense.expenseId) {
            <div class="expense-card">
              <div class="card-icon">
                <mat-icon>receipt_long</mat-icon>
              </div>

              <div class="card-info">
                <h3 class="expense-name">{{ expense.expenseName }}</h3>
                <span class="expense-type">{{ expense.expenseType }}</span>
              </div>

              <div class="card-actions">
                <div class="price-tag">
                  $ {{ expense.expenseTotalPrice | number:'1.2-2' }}
                </div>
                <button class="btn-delete" (click)="deleteExpense(expense.expenseId)">
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1000px; margin: 0 auto; padding: 2rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      font-family: 'Segoe UI', sans-serif;
    }

    .header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 2.5rem;
    }

    .page-title {
      font-size: 2.5rem; font-weight: 800; margin: 0;
      background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .btn-add {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; border: none; padding: 0.75rem 1.5rem;
      border-radius: 12px; font-weight: 600; cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      transition: all 0.2s;
    }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4); }

    .expenses-grid { display: flex; flex-direction: column; gap: 1rem; }

    .expense-card {
      background: white; border-radius: 16px;
      padding: 1.25rem;
      display: flex; align-items: center; gap: 1.5rem;
      box-shadow: 0 4px 16px rgba(0,0,0,0.05);
      border: 1px solid transparent;
      transition: all 0.3s ease;
    }

    .expense-card:hover {
      transform: translateY(-2px);
      border-color: #ff6b35;
      box-shadow: 0 8px 24px rgba(255, 107, 53, 0.1);
    }

    .card-icon {
      width: 48px; height: 48px;
      background: #fff5f0; color: #ff6b35;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }

    .card-info { flex: 1; }
    .expense-name { margin: 0; font-size: 1.1rem; font-weight: 700; color: #333; }
    .expense-type { font-size: 0.85rem; color: #999; text-transform: uppercase; font-weight: 600; }

    .card-actions {
      display: flex; align-items: center; gap: 1.5rem;
    }

    .price-tag {
      font-size: 1.25rem; font-weight: 800; color: #1a1a1a;
    }

    .btn-delete {
      background: #fee2e2; color: #b91c1c;
      border: none; padding: 0.5rem 1rem; border-radius: 8px;
      font-weight: 600; cursor: pointer; font-size: 0.85rem;
      transition: background 0.2s;
    }
    .btn-delete:hover { background: #fecaca; }

    @media (max-width: 600px) {
      .expense-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .card-actions { width: 100%; justify-content: space-between; margin-top: 0.5rem; }
    }
  `]
})
export class ExpensesPageComponent {
  expenses: Expense[] = [
    {
      expenseId: 1, expenseName: 'Oil Change', expenseAmount: 2,
      expenseUnitPrice: 15, expenseTotalPrice: 30, expenseType: 'Maintenance'
    },
    {
      expenseId: 2, expenseName: 'Brake Pads', expenseAmount: 1,
      expenseUnitPrice: 40, expenseTotalPrice: 40, expenseType: 'Parts'
    },
    {
      expenseId: 3, expenseName: 'Chain Lube', expenseAmount: 1,
      expenseUnitPrice: 10, expenseTotalPrice: 10, expenseType: 'Supplies'
    }
  ];

  deleteExpense(id: number) {
    console.log('Deleting expense', id);
    this.expenses = this.expenses.filter(e => e.expenseId !== id);
  }
}
