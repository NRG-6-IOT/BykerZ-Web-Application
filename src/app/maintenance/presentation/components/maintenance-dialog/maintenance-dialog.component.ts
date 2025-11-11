import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {format} from '@formkit/tempo';
import {MatTableModule} from '@angular/material/table';
import {CommonModule} from '@angular/common';
import { Maintenance } from '@app/maintenance/domain/model/maintenance.entity';


@Component({
  selector: 'app-maintenance-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule,MatTableModule,CommonModule],
  template: `
    <div class="w-full h-full bg-[#380800] text-white">
      <mat-dialog-content >
        <div class="text-white">
          <p><strong>Detalles del mantenimiento:</strong> {{ maintenance.details }}</p>
          <p><strong>Mecanico ID:</strong> {{maintenance.mechanicId}}</p>
          <p><strong>Vehiculo ID:</strong> {{maintenance.vehicleId}}</p>
          <p><strong>Lugar:</strong> {{maintenance.location}}</p>
          <p><strong>Fecha:</strong> {{format(maintenance.dateOfService,"DD/MM/YYYY","es")}}</p>
          <p><strong>Hora:</strong> {{format(maintenance.dateOfService,"hh:mm","es")}}</p>
          <p><strong>Descripcion:</strong> {{maintenance.description}}</p>
          <p><strong>Estado:</strong> {{maintenance.state}}</p>
          @if (maintenance.expense) {
            <p class="mb-1"><strong>
              Gastos:
            </strong></p>
            <div class="bg-white rounded-2xl text-black p-4">
              <table mat-table [dataSource]="maintenance.expense.items" class="mat-elevation-z8">

                <ng-container matColumnDef="Name">
                  <th mat-header-cell *matHeaderCellDef> Name </th>
                  <td mat-cell *matCellDef="let item"> {{ item.name}} </td>
                </ng-container>

                <ng-container matColumnDef="ItemType">
                  <th mat-header-cell *matHeaderCellDef> Item Type </th>
                  <td mat-cell *matCellDef="let item"> {{ item.itemType}} </td>
                </ng-container>

                <ng-container matColumnDef="Amount">
                  <th mat-header-cell *matHeaderCellDef> Amount </th>
                  <td mat-cell *matCellDef="let item"> {{ item.amount}} </td>
                </ng-container>

                <ng-container matColumnDef="UnitPrice">
                  <th mat-header-cell *matHeaderCellDef> Unit Price </th>
                  <td mat-cell *matCellDef="let item"> {{ item.unitPrice}} </td>
                </ng-container>

                <ng-container matColumnDef="TotalPrice">
                  <th mat-header-cell *matHeaderCellDef> Total Price </th>
                  <td mat-cell *matCellDef="let item"> {{ item.totalPrice}} </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
              <div class="mt-4 text-right">
                <p><strong>Precio Final:</strong> {{ maintenance.expense.finalPrice }}</p>
              </div>
            </div>
          }


        </div>

      </mat-dialog-content>

      <mat-dialog-actions>
        <button matButton mat-dialog-close>Close</button>
      </mat-dialog-actions>

    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceDialogComponent {

  displayedColumns: string[] = ['Name', 'ItemType', 'Amount', 'UnitPrice', 'TotalPrice'];


  data = inject<{ maintenance: Maintenance }>(MAT_DIALOG_DATA);
  maintenance = this.data.maintenance;
  protected readonly format = format;
}
