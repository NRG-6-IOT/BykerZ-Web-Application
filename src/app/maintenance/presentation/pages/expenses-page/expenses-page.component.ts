import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '@app/maintenance/domain/model/expense.entity';

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
          @for (expense of expenses; track expense.id) {
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
                <div class="border-r-black border-r flex justify-center items-center">{{expense.name}}</div>
                <div class="border-r-black border-r flex justify-center items-center">{{expense.expenseType}}</div>
                <div class="flex justify-center items-center">{{expense.finalPrice}}</div>
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
      id: 1,
      name: 'Oil Change',
      finalPrice: 30,
      expenseType: 'PERSONAL',
      items: [
        {
          id: 1,
          name: 'Engine Oil',
          amount: 2,
          unitPrice: 15,
          totalPrice: 30,
          itemType: 'SUPPLIES'
        }
      ]
    },
    {
      id: 2,
      name: 'Brake Pads',
      finalPrice: 40,
      expenseType: 'PERSONAL',
      items: [
        {
          id: 2,
          name: 'Brake Pads',
          amount: 1,
          unitPrice: 40,
          totalPrice: 40,
          itemType: 'SUPPLIES'
        }
      ]
    },
    {
      id: 3,
      name: 'Chain Lube',
      finalPrice: 10,
      expenseType: 'PERSONAL',
      items: [
        {
          id: 3,
          name: 'Chain Lube',
          amount: 1,
          unitPrice: 10,
          totalPrice: 10,
          itemType: 'SUPPLIES'
        }
      ]
    }
  ];
}
