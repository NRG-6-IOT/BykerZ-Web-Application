import { Component } from '@angular/core';
import {Expense} from '@app/shared/domain/model/expense.entity';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-expenses-page',
  imports: [
    MatIconModule
  ],
  template: `
    <div class="w-full h-full p-10 relative">
      <div>
        <h2 class="text-3xl font-bold mb-4">Expenses</h2>
        <div class="flex flex-col gap-4 mb-4">
          @for (expense of expenses; track expense.expenseId) {
            <div class="bg-[#FF6B35] p-4 rounded-2xl flex flex-row-reverse [&:has(.icon-container:hover)]:bg-[#ff9169] transition-colors">
              <div class="flex justify-center items-center px-10 icon-container group" style="color: white">
                <mat-icon class="scale-200 group-hover:scale-225 transition-transform ease-in-out" fontIcon="arrow_forward_ios"></mat-icon>
              </div>
              <div class="flex justify-center items-center px-10">
                <button class="rounded-2xl px-6 py-1 bg-[#380800] text-white transition-colors hover:bg-[#613930] ">
                  Delete
                </button>
              </div>

              <div class="bg-white p-2 rounded-xl grid grid-cols-3 flex-1 min-h-25 ">
                <div class="border-r-black border-r flex justify-center items-center">{{expense.expenseName}}</div>
                <div class="border-r-black border-r flex justify-center items-center">{{expense.expenseType}}</div>
                <div class="flex justify-center items-center">{{expense.expenseTotalPrice}}</div>
              </div>

            </div>
          }
        </div>
      </div>
      <button class="rounded-2xl px-6 py-1 bg-[#380800] text-white transition-colors hover:bg-[#613930]">

      </button>
    </div>
  `,
  styles: ``
})
export class ExpensesPageComponent {
  expenses: Expense[] = [
    {
      expenseId: 1,
      expenseName: 'Oil Change',
      expenseAmount: 2,
      expenseUnitPrice: 15,
      expenseTotalPrice: 30,
      expenseType: 'Maintenance'
    },
    {
      expenseId: 2,
      expenseName: 'Brake Pads',
      expenseAmount: 1,
      expenseUnitPrice: 40,
      expenseTotalPrice: 40,
      expenseType: 'Parts'
    },
    {
      expenseId: 3,
      expenseName: 'Chain Lube',
      expenseAmount: 1,
      expenseUnitPrice: 10,
      expenseTotalPrice: 10,
      expenseType: 'Supplies'
    }
  ];
}
