import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ExpenseService} from '@app/maintenance/infrastructure/expense.service';
import {Expense} from '@app/maintenance/domain/model/expense.entity';

@Component({
  selector: 'app-owner-expense-details-page',
  imports: [CommonModule],
  template: `
    <div class="w-full h-full p-10 relative">
      @if (expense) {
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-3xl font-bold">{{expense.name}}</h1>
            <p class="text-lg font-medium">{{expense.expenseType}}</p>
          </div>

        </div>

        <div class="bg-[#FF6B35] p-6 rounded-2xl">
          <!-- Table -->
          <div class="bg-white rounded-lg mb-4 overflow-hidden">
            <table class="w-full text-black">
              <thead class="bg-gray-200">
                <tr>
                  <th class="p-3 text-center">Name</th>
                  <th class="p-3 text-center">Item Type</th>
                  <th class="p-3 text-center">Amount</th>
                  <th class="p-3 text-center">Unit Price</th>
                  <th class="p-3 text-center">Total Price</th>
                </tr>
              </thead>
              <tbody>
                @if (expense.items.length === 0) {
                  <tr>
                    <td colspan="5" class="p-4 text-center text-gray-500">No items found</td>
                  </tr>
                }
                @for (item of expense.items; track item.id) {
                  <tr class="border-t">
                    <td class="p-3 text-center">{{item.name}}</td>
                    <td class="p-3 text-center">{{item.itemType}}</td>
                    <td class="p-3 text-center">{{item.amount}}</td>
                    <td class="p-3 text-center">{{item.unitPrice | number:'1.2-2'}}</td>
                    <td class="p-3 text-center">{{item.totalPrice | number:'1.2-2'}}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Final Price -->
          <div class="text-white text-xl font-bold">
            Final Price: {{expense.finalPrice | number:'1.2-2'}}
          </div>
        </div>
      } @else {
        <div class="text-center text-gray-500 py-8">
          Loading expense details...
        </div>
      }
    </div>
  `,
  styles: ``,
})
export class OwnerExpenseDetailsPageComponent implements OnInit {
  expense: Expense | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('expenseId');
    if (expenseId) {
      this.loadExpense(parseInt(expenseId));
    }
  }

  loadExpense(expenseId: number): void {
    this.expenseService.getExpenseById(expenseId).subscribe({
      next: (expense) => {
        this.expense = expense;
      },
      error: (error) => {
        console.error('Error loading expense:', error);
        // Optionally navigate back or show error message
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/expenses']);
    /*
    * <button
            (click)="goBack()"
            class="text-white bg-[#FF6B35] px-6 py-2 rounded-2xl hover:bg-[#ff9169] transition-colors font-bold">
            Back to Expenses
          </button>
    * */

  }
}
