import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';

interface ExpenseItem {
  id: number;
  name: string;
  amount: number;
  unitPrice: number;
  totalPrice: number;
  itemType: 'FINE' | 'PARKING' | 'PAYMENT' | 'SUPPLIES' | 'TAX' | 'TOOLS';
}

interface Expense {
  id: number;
  name: string;
  finalPrice: number;
  expenseType: 'PERSONAL' | 'MAINTENANCE';
  items: ExpenseItem[];
}

@Component({
  selector: 'app-owner-expense-details-page',
  imports: [CommonModule],
  template: `
    <div class="w-full h-full p-10 relative">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h1 class="text-3xl font-bold">{{expense?.name}}</h1>
          <p class="text-lg font-medium">{{expense?.expenseType}}</p>
        </div>
        <button
          (click)="goBack()"
          class="text-white bg-[#FF6B35] px-6 py-2 rounded-2xl hover:bg-[#ff9169] transition-colors font-bold">
          Back to Expenses
        </button>
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
              @if (expense && expense.items && expense.items.length === 0) {
                <tr>
                  <td colspan="5" class="p-4 text-center text-gray-500">No items found</td>
                </tr>
              }
              @if (expense && expense.items) {
                @for (item of expense.items; track item.id) {
                  <tr class="border-t">
                    <td class="p-3 text-center">{{item.name}}</td>
                    <td class="p-3 text-center">{{item.itemType}}</td>
                    <td class="p-3 text-center">{{item.amount}}</td>
                    <td class="p-3 text-center">{{item.unitPrice | number:'1.2-2'}}</td>
                    <td class="p-3 text-center">{{item.totalPrice | number:'1.2-2'}}</td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Final Price -->
        <div class="text-white text-xl font-bold">
          Final Price: {{expense?.finalPrice | number:'1.2-2'}}
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class OwnerExpenseDetailsPageComponent implements OnInit {
  expense: Expense | undefined;

  // Mock data
  private expenses: Expense[] = [
    {
      "id": 1,
      "name": "string",
      "finalPrice": 0,
      "expenseType": "PERSONAL",
      "items": [
        {
          "id": 1,
          "name": "string",
          "amount": 0,
          "unitPrice": 0,
          "totalPrice": 0,
          "itemType": "TOOLS"
        }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('expenseId');
    if (expenseId) {
      this.expense = this.expenses.find(e => e.id === parseInt(expenseId));
    }
  }

  goBack(): void {
    this.router.navigate(['/expenses']);
  }
}
