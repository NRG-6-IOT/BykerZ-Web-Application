import {Component, inject, signal, computed, ChangeDetectionStrategy} from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-create-expense-dialog',
  standalone: true,
  imports: [
    CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, FormsModule, TranslateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ 'expenses.create.title' | translate }}</h2>
        <button class="close-icon" (click)="onCancelClick()">×</button>
      </div>

      <div class="form-section">
        <mat-form-field appearance="outline" class="custom-field w-full">
          <mat-label>{{ 'expenses.create.expenseTitlePlaceholder' | translate }}</mat-label>
          <input matInput [(ngModel)]="expenseName" />
        </mat-form-field>
      </div>

      <div class="add-item-box">
        <h4 class="box-title">{{ 'expenses.create.addItemsTitle' | translate }}</h4>
        <div class="input-grid">
          <mat-form-field appearance="outline" class="custom-field item-name">
            <mat-label>{{ 'expenses.create.itemName' | translate }}</mat-label>
            <input matInput [(ngModel)]="itemName" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="custom-field item-type">
            <mat-label>{{ 'expenses.create.itemType' | translate }}</mat-label>
            <mat-select [(ngModel)]="itemType">
              <mat-option *ngFor="let type of itemTypes" [value]="type">{{type}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="custom-field item-qty">
            <mat-label>{{ 'expenses.create.itemQty' | translate }}</mat-label>
            <input matInput type="number" [(ngModel)]="itemAmount" min="1" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="custom-field item-price">
            <mat-label>{{ 'expenses.create.itemPrice' | translate }}</mat-label>
            <span matPrefix>$&nbsp;</span>
            <input matInput type="number" [(ngModel)]="itemUnitPrice" min="0" step="0.01" />
          </mat-form-field>

          <button class="btn-add" (click)="addItem()">
            <span class="plus-icon">+</span>
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="items-table">
          <thead>
          <tr>
            <th class="pl-4">{{ 'expenses.table.item' | translate }}</th>
            <th class="text-center">{{ 'expenses.table.type' | translate }}</th>
            <th class="text-center">{{ 'expenses.table.qty' | translate }}</th>
            <th class="text-right">{{ 'expenses.table.unit' | translate }}</th>
            <th class="text-right pr-4">{{ 'expenses.table.total' | translate }}</th>
            <th class="w-10"></th>
          </tr>
          </thead>
          <tbody>
          <tr *ngIf="items().length === 0">
            <td colspan="6" class="empty-cell">
              <div class="empty-state">{{ 'expenses.create.noItems' | translate }}</div>
            </td>
          </tr>
          <tr *ngFor="let item of items(); let i = index">
            <td class="pl-4 font-medium">{{item.name}}</td>
            <td class="text-center"><span class="type-badge">{{item.itemType}}</span></td>
            <td class="text-center">{{item.amount}}</td>
            <td class="text-right">{{item.unitPrice | number:'1.2-2'}}</td>
            <td class="text-right pr-4 font-bold text-orange">{{item.totalPrice | number:'1.2-2'}}</td>
            <td class="text-center">
              <button class="btn-remove" (click)="removeItem(i)">×</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="footer">
        <div class="total-display">
          <span class="total-label">{{ 'expenses.finalPrice' | translate }}:</span>
          <span class="sum">$ {{totalSum() | number:'1.2-2'}}</span>
        </div>

        <div class="actions">
          <button class="btn-cancel" (click)="onCancelClick()">{{ 'common.cancel' | translate }}</button>
          <button class="btn-create" (click)="onCreate()"
                  [disabled]="items().length === 0 || !expenseName.trim()">
            {{ 'expenses.create.submitButton' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0; background: white; border-radius: 20px;
      min-width: 700px; overflow: hidden;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .dialog-header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center;
    }

    .dialog-title {
      font-size: 1.5rem; font-weight: 700; color: white; margin: 0;
      letter-spacing: -0.5px;
    }

    .close-icon {
      background: rgba(255,255,255,0.1); border: none; color: white;
      width: 32px; height: 32px; border-radius: 50%; font-size: 1.5rem;
      cursor: pointer; line-height: 1; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .close-icon:hover { background: rgba(255,255,255,0.2); }

    .form-section { padding: 1.5rem 2rem 0; }
    .w-full { width: 100%; }

    /* --- ESTILOS DE INPUTS PERSONALIZADOS (GLASS/CLEAN) - CORREGIDO --- */

    /* 1. Ocultar agresivamente el borde nativo (Notched Outline) */
    ::ng-deep .custom-field .mdc-notched-outline,
    ::ng-deep .custom-field .mdc-notched-outline__leading,
    ::ng-deep .custom-field .mdc-notched-outline__notch,
    ::ng-deep .custom-field .mdc-notched-outline__trailing {
      display: none !important;
      border: none !important;
    }

    /* 2. Dar estilo al contenedor flexible para que sea nuestro "borde" */
    ::ng-deep .custom-field .mat-mdc-form-field-flex {
      background-color: #f8f9fa !important; /* Fondo gris suave */
      border-radius: 12px !important;
      padding: 0 16px !important; /* Padding interno */
      border: 1px solid #e0e0e0; /* Borde propio sutil */
      transition: all 0.2s ease;
      height: 56px; /* Altura fija */
      align-items: center;
    }

    /* 3. Hover */
    ::ng-deep .custom-field:hover .mat-mdc-form-field-flex {
      background-color: #fff !important;
      border-color: #bdbdbd;
    }

    /* 4. Focus (Borde Naranja) */
    ::ng-deep .custom-field.mat-focused .mat-mdc-form-field-flex {
      border-color: #ff6b35 !important;
      background-color: #fff !important;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1); /* Glow naranja suave */
    }

    /* 5. Ajustar la etiqueta flotante */
    ::ng-deep .custom-field .mat-mdc-floating-label {
      top: 50% !important;
      left: 16px !important;
      transform: translateY(-50%);
      color: #999; font-weight: 500;
      transition: all 0.2s ease;
      pointer-events: none;
    }

    /* 6. Etiqueta cuando sube (focus o con valor) */
    ::ng-deep .custom-field.mat-form-field-should-float .mat-mdc-floating-label {
      transform: translateY(-28px) scale(0.85) !important; /* Subir arriba del input */
      color: #ff6b35 !important;
      position: absolute;
      background: white; /* Truco para tapar la línea si pasara por detrás */
      padding: 0 4px;
      margin-left: -4px;
    }

    /* Input real */
    ::ng-deep .custom-field input,
    ::ng-deep .custom-field .mat-mdc-select-value {
      color: #333; font-weight: 600;
    }

    /* Ocultar linea inferior si estuviera presente (legacy) */
    ::ng-deep .custom-field .mat-mdc-form-field-bottom-align::before { display: none !important; }
    /* ---------------------------------------------------- */


    .add-item-box {
      background: #fff; padding: 0 2rem 1.5rem;
    }
    .box-title {
      font-size: 0.8rem; text-transform: uppercase; color: #ff6b35;
      font-weight: 700; letter-spacing: 1px; margin: 1.5rem 0 1rem;
    }

    .input-grid {
      display: grid; grid-template-columns: 2fr 1.2fr 0.8fr 1fr auto; gap: 1rem; align-items: start;
    }

    .btn-add {
      height: 56px; width: 56px;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white; border: none; border-radius: 12px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: transform 0.2s;
    }
    .btn-add:hover { transform: translateY(-2px); background: #000; }
    .plus-icon { font-size: 1.5rem; font-weight: 300; }

    .table-container {
      margin: 0 2rem 2rem; border: 1px solid #eee; border-radius: 12px; overflow: hidden;
    }
    .items-table { width: 100%; border-collapse: collapse; }
    .items-table th {
      background: #f9f9f9; padding: 1rem 0.5rem; text-align: left;
      font-size: 0.75rem; color: #666; font-weight: 700; text-transform: uppercase;
    }
    .items-table td {
      padding: 1rem 0.5rem; border-top: 1px solid #f0f0f0; font-size: 0.95rem; color: #333;
    }
    .empty-state { text-align: center; color: #bbb; font-style: italic; padding: 2rem; }

    .type-badge {
      background: #eff6ff; color: #1d4ed8; font-size: 0.7rem; padding: 3px 8px;
      border-radius: 10px; font-weight: 600; text-transform: uppercase;
    }
    .text-orange { color: #ff6b35; }
    .font-medium { font-weight: 600; }

    .btn-remove {
      background: none; border: none; color: #ccc; font-size: 1.2rem; cursor: pointer;
      transition: color 0.2s;
    }
    .btn-remove:hover { color: #ef4444; }

    .footer {
      background: #fcfcfc; padding: 1.5rem 2rem; border-top: 1px solid #eee;
      display: flex; justify-content: space-between; align-items: center;
    }

    .total-display { display: flex; flex-direction: column; }
    .total-label { font-size: 0.85rem; color: #666; font-weight: 600; text-transform: uppercase; }
    .sum { font-size: 1.75rem; font-weight: 800; color: #1a1a1a; line-height: 1.2; }

    .actions { display: flex; gap: 1rem; }
    .btn-cancel {
      background: white; border: 1px solid #ddd; color: #666;
      padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 600; cursor: pointer;
    }
    .btn-create {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; border: none; padding: 0.75rem 2rem; border-radius: 10px;
      font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
      transition: opacity 0.2s;
    }
    .btn-create:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-create:hover:not(:disabled) { box-shadow: 0 6px 16px rgba(255, 107, 53, 0.4); transform: translateY(-1px); }
  `]
})
export class CreateExpenseDialog {
  readonly dialogRef = inject(MatDialogRef<CreateExpenseDialog>);
  readonly expenseStore = inject(ExpenseStore);

  expenseName = '';
  itemName = ''; itemAmount = 1; itemUnitPrice = 0; itemType = 'SUPPLIES';
  itemTypes = ['FINE', 'PARKING', 'PAYMENT', 'SUPPLIES', 'TAX', 'TOOLS'];
  items = signal<any[]>([]);
  totalSum = computed(() => this.items().reduce((sum, item) => sum + item.totalPrice, 0));

  addItem(): void {
    if (!this.itemName.trim() || this.itemAmount <= 0) return;
    const newItem = {
      name: this.itemName, amount: this.itemAmount, unitPrice: this.itemUnitPrice,
      totalPrice: this.itemAmount * this.itemUnitPrice, itemType: this.itemType
    };
    this.items.update(items => [...items, newItem]);
    this.itemName = ''; this.itemAmount = 1; this.itemUnitPrice = 0;
  }

  removeItem(index: number): void {
    this.items.update(items => items.filter((_, i) => i !== index));
  }

  onCancelClick(): void { this.dialogRef.close(); }
  onCreate(): void {
    if (this.items().length && this.expenseName) {
      this.dialogRef.close({
        name: this.expenseName, finalPrice: this.totalSum(), expenseType: 'PERSONAL', items: this.items()
      });
    }
  }
}
