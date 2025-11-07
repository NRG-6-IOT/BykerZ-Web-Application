import {Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {
  CreateExpenseDialogComponent
} from '@app/maintenance/presentation/components/create-expense-dialog/create-expense-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-owner-expenses-page',
  imports: [
    MatIconModule
  ],
  template: `
    <div class="w-full h-full p-10 relative">
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
      <button
        (click)="openDialog()"
        class="bg-[#FF6B35] text-white w-16 h-16 rounded-2xl flex justify-center items-center text-4xl font-bold absolute bottom-20 right-20 hover:bg-[#ff9169] transition-colors cursor-pointer">
        +
      </button>
    </div>
  `,
  styles: ``,
})
export class OwnerExpensesPageComponent {
  expenses = [
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

  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(CreateExpenseDialogComponent, {
      data: {name: "xdddx", animal: "animal p"},
    });
  }

}
