import { Component } from '@angular/core';
import {ScheduledMaintenance} from '@app/wellness/model/schedule-maintenance.entity';
import {CompletedMaintenance} from '@app/wellness/model/completed-maintenance.entity';
import { format } from "@formkit/tempo"
import {MatDialog} from '@angular/material/dialog';
import {MaintenanceDialogComponent} from '@app/wellness/components/maintenance-dialog/maintenance-dialog.component';


@Component({
  selector: 'app-maintenence',
  imports: [],
  template: `
    <div class="w-full h-full p-10">
      <div>
        <h2 class="text-3xl font-bold mb-4">Mantenimientos Programados</h2>
        <div class="flex flex-col gap-4 mb-4">
          @for (maintenance of scheduledMaintenances; track maintenance.maintenanceId) {
            <div class="bg-[#FF6B35] p-4 rounded-2xl">
              <div class="bg-white p-2 rounded-xl text-center">
                <p><strong>{{ format(maintenance.maintenanceDate, "DD/MM/YYYY h:mm", "es") }} - </strong>  {{ maintenance.maintenanceAddress }}</p>
                <p><strong>{{ maintenance.mechanicName}}</strong> revisara tu moto {{maintenance.vehicleName}}</p>
                <p><strong>Motivo:</strong> {{maintenance.maintenanceReason}}</p>
              </div>
            </div>
          }
        </div>
      </div>
      <div>
        <h2 class="text-3xl font-bold mb-4">Mantenimientos Hechos</h2>
        <div class="flex flex-col gap-4 mb-4">
          @for (maintenance of completedMaintenances; track maintenance.maintenanceId) {
            <div class="bg-[#FF6B35] p-4 rounded-2xl hover:bg-[#ff9169] transition-colors" (click)="openDialog(maintenance)">
              <div class="bg-white p-2 rounded-xl text-center">
                <p><strong>{{ format(maintenance.maintenanceDate, "DD/MM/YYYY h:mm", "es") }} - </strong>  {{ maintenance.maintenanceAddress }}</p>
                <p><strong>{{ maintenance.mechanicName}}</strong> revisara tu moto {{maintenance.vehicleName}}</p>
                <p><strong>Detalles:</strong> {{maintenance.maintenanceDetails}}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class MaintenanceComponent {

  constructor(private dialog: MatDialog) {
  }



  scheduledMaintenances: ScheduledMaintenance[] = [
    {
      maintenanceId: 1,
      maintenanceDate: new Date(),
      maintenanceAddress: "Av. Rafael Escardo 201",
      mechanicName: "Hernandez Hernandez",
      vehicleName: "Honda CB190R",
      maintenanceReason: "Fallo de tanque de gasolina"
    },
    {
      maintenanceId: 2,
      maintenanceDate: new Date(),
      maintenanceAddress: "Av. Rafael Escardo 201",
      mechanicName: "Hernandez Hernandez",
      vehicleName: "Honda CB300 Twister",
      maintenanceReason: "Revisión general de la moto"
    }
  ];

  completedMaintenances: CompletedMaintenance[] = [
    {
      maintenanceId: 1,
      maintenanceDate: new Date(),
      maintenanceAddress: "Talambo 135, San Miguel 15087",
      mechanicName: "Hernandez Hernandez",
      ownerName: "Luis Alberto Torres Díaz",
      vehicleName: "Honda CB300 Twister",
      maintenanceDetails: "Se cambiaron los neumáticos delanteros debido a una perforación en ambas.",
      maintenanceDescription: "la moto piso una llave en el cilindro. no sufrió mayor daño",
      expenses: [
        {
          expenseId: 1,
          expenseName: "Neumatico",
          expenseAmount: 200,
          expenseUnitPrice: 2,
          expenseTotalPrice: 400,
        }
      ]
    }
  ];
  protected readonly format = format;


  openDialog(maintenance : CompletedMaintenance) {
    this.dialog.open(MaintenanceDialogComponent, {
      data: {
        maintenance: maintenance
      }
    });
  }

}
