import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-expenses-detail-page',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="page">
      <div *ngIf="expenseStore.loading()" class="loading">Loading...</div>

      <div *ngIf="expense() as exp" class="specs-card">
        <div class="card-header">
          <h2 class="section-title">{{exp.name}}</h2>
          <p class="section-subtitle">{{exp.expenseType}}</p>
          <button class="back-btn" (click)="isOwner() ? goBack() : goToMaintenances()">
            ← Back
          </button>
        </div>

        <div class="specs-grid">
           <div class="spec-row header">
             <div class="col">Item</div>
             <div class="col">Type</div>
             <div class="col right">Qty</div>
             <div class="col right">Unit</div>
             <div class="col right">Total</div>
           </div>

           <div class="spec-row" *ngFor="let item of exp.items">
             <div class="col name">{{item.name}}</div>
             <div class="col type">{{item.itemType}}</div>
             <div class="col right">{{item.amount}}</div>
             <div class="col right">{{item.unitPrice | number:'1.2-2'}}</div>
             <div class="col right highlight">{{item.totalPrice | number:'1.2-2'}}</div>
           </div>

           <div class="total-section">
             <span class="total-label">Final Price</span>
             <span class="total-value">{{exp.finalPrice | number:'1.2-2'}}</span>
           </div>
        </div>
      </div>

      <div *ngIf="!expenseStore.loading() && !expense()" class="error-state">Expense not found</div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 800px; margin: 0 auto; padding: 2rem;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }

    .specs-card {
      background: white; border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); overflow: hidden;
      animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .card-header {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      padding: 2rem; text-align: center; color: white; position: relative;
    }

    .section-title { font-size: 2rem; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
    .section-subtitle { opacity: 0.8; margin: 0.5rem 0 0; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }

    .back-btn {
      position: absolute; top: 1.5rem; left: 1.5rem;
      background: rgba(255,255,255,0.2); border: none; color: white;
      padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 600;
      backdrop-filter: blur(4px); transition: background 0.2s;
    }
    .back-btn:hover { background: rgba(255,255,255,0.3); }

    .specs-grid { padding: 0; }

    .spec-row {
      display: grid; grid-template-columns: 2fr 1.5fr 0.8fr 1fr 1fr;
      padding: 1.25rem; border-bottom: 1px solid #f5f5f5;
      align-items: center; gap: 1rem;
    }
    .spec-row:last-child { border-bottom: none; }
    .spec-row.header { background: #f9f9f9; color: #999; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; }

    .col { font-size: 0.95rem; color: #333; }
    .col.name { font-weight: 600; }
    .col.type { color: #666; font-size: 0.85rem; background: #eee; padding: 2px 8px; border-radius: 4px; width: fit-content; }
    .col.right { text-align: right; }
    .col.highlight { color: #ff6b35; font-weight: 700; }

    .total-section {
      background: linear-gradient(135deg, #fff5f0 0%, #ffe8dc 100%);
      padding: 1.5rem; display: flex; justify-content: space-between; align-items: center;
      border-top: 2px solid #ffefe5;
    }
    .total-label { font-size: 1.1rem; color: #666; font-weight: 600; }
    .total-value { font-size: 2rem; color: #ff6b35; font-weight: 800; }

    .loading, .error-state { text-align: center; padding: 3rem; color: #999; }
  `]
})
export class ExpensesDetailPage implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly expenseStore = inject(ExpenseStore);
  expense = this.expenseStore.selectedExpense;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.expenseStore.loadExpenseById(parseInt(id, 10));
  }

  isOwner(): boolean { return localStorage.getItem('user_role') === 'ROLE_OWNER'; }
  goBack(): void { this.router.navigate(['/expenses']); }
  goToMaintenances(){ this.router.navigate(['/maintenances/mechanic']); }
}
