import {Component, inject, signal, computed, ChangeDetectionStrategy} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

type ItemType = 'FINE' | 'PARKING' | 'PAYMENT' | 'SUPPLIES' | 'TAX' | 'TOOLS';

interface ExpenseItem {
  name: string;
  amount: number;
  unitPrice: number;
  totalPrice: number;
  itemType: ItemType;
}

interface ExpenseResult {
  name: string;
  finalPrice: number;
  expenseType: string;
  items: ExpenseItem[];
}

@Component({
  selector: 'app-create-expense-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#380800] p-6 text-white min-w-[50rem] rounded-2xl">
      <h2 class="text-2xl font-bold mb-6 text-white">Create Expense</h2>

      <!-- Expense Name -->
      <div class="mb-4">
        <mat-form-field class="w-full" appearance="fill">
          <mat-label>Expense Name</mat-label>
          <input matInput [(ngModel)]="expenseName" class="bg-white text-black" placeholder="Enter expense name" />
        </mat-form-field>
      </div>

      <!-- Form -->
      <div class="flex gap-2 mb-4">
        <mat-form-field class="" appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="itemName" class="bg-white text-black" />
        </mat-form-field>

        <mat-form-field class="" appearance="fill">
          <mat-label>Amount</mat-label>
          <input matInput type="number" [(ngModel)]="itemAmount" class="bg-white text-black" min="1" />
        </mat-form-field>

        <mat-form-field class="" appearance="fill">
          <mat-label>Unit Price</mat-label>
          <input matInput type="number" [(ngModel)]="itemUnitPrice" class="bg-white text-black" min="0" step="0.01" />
        </mat-form-field>

        <mat-form-field class="" appearance="fill">
          <mat-label>Item Type</mat-label>
          <mat-select [(ngModel)]="itemType" class="">
            @for (type of itemTypes; track type) {
              <mat-option [value]="type">{{type}}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button  class="bg-[#FF6B35] text-white font-bold hover:bg-[#ff9169] h-14 px-4 rounded-2xl transition-colors" (click)="addItem()">
          Add item
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-lg mb-4 overflow-hidden">
        <table class="w-full text-black">
          <thead class="bg-gray-200">
            <tr>
              <th class="p-2 text-center">Name</th>
              <th class="p-2 text-center">Amount</th>
              <th class="p-2 text-center">Unit Price</th>
              <th class="p-2 text-center">Item Type</th>
              <th class="p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            @if (items().length === 0) {
              <tr>
                <td colspan="5" class="p-4 text-center text-gray-500">No items added yet</td>
              </tr>
            }
            @for (item of items(); track $index) {
              <tr class="border-t">
                <td class="p-2 text-center">{{item.name}}</td>
                <td class="p-2 text-center">{{item.amount}}</td>
                <td class="p-2 text-center">{{item.unitPrice | number:'1.2-2'}}</td>
                <td class="p-2 text-center">{{item.itemType}}</td>
                <td class="p-2 text-center">{{item.totalPrice | number:'1.2-2'}}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div class="text-white mb-6 text-lg">
        <strong>Total Sum: {{totalSum() | number:'1.2-2'}}</strong>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-4">
        <button class=" bg-white text-black font-bold py-2 px-4 rounded-2xl hover:bg-gray-300 transition-colors" (click)="onCancelClick()">
          Cancel
        </button>
        <button  class="bg-[#FF6B35] text-white font-bold hover:bg-[#ff9169] py-2 px-4 rounded-2xl transition-colors" (click)="onCreate()">
          Create Expense
        </button>
      </div>
    </div>
  `,
  styles: `
  `,
})
export class CreateExpenseDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateExpenseDialogComponent>);

  // Expense name
  expenseName = '';

  // Form fields
  itemName = '';
  itemAmount = 1;
  itemUnitPrice = 0;
  itemType: ItemType = 'SUPPLIES';

  // Available item types
  itemTypes: ItemType[] = ['FINE', 'PARKING', 'PAYMENT', 'SUPPLIES', 'TAX', 'TOOLS'];

  // Items list as signal
  items = signal<ExpenseItem[]>([]);

  // Computed total sum
  totalSum = computed(() => {
    return this.items().reduce((sum, item) => sum + item.totalPrice, 0);
  });

  addItem(): void {
    if (!this.itemName.trim() || this.itemAmount <= 0 || this.itemUnitPrice < 0) {
      return;
    }

    const newItem: ExpenseItem = {
      name: this.itemName,
      amount: this.itemAmount,
      unitPrice: this.itemUnitPrice,
      totalPrice: this.itemAmount * this.itemUnitPrice,
      itemType: this.itemType
    };

    this.items.update(items => [...items, newItem]);

    // Reset form
    this.itemName = '';
    this.itemAmount = 1;
    this.itemUnitPrice = 0;
    this.itemType = 'TOOLS';
  }

  onCancelClick(): void {
    this.resetForm();
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.items().length === 0 || !this.expenseName.trim()) {
      return;
    }

    const expense: ExpenseResult = {
      name: this.expenseName,
      finalPrice: this.totalSum(),
      expenseType: 'PERSONAL',
      items: this.items()
    };

    this.dialogRef.close(expense);
  }

  resetForm(): void {
    this.expenseName = '';
    this.itemName = '';
    this.itemAmount = 1;
    this.itemUnitPrice = 0;
    this.itemType = 'TOOLS';
    this.items.set([]);
  }
}
