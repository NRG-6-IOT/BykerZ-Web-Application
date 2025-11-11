import { Component } from '@angular/core';
import { format } from "@formkit/tempo"
import {MatDialog} from '@angular/material/dialog';
import {MaintenanceDialogComponent} from '@app/maintenance/presentation/components/maintenance-dialog/maintenance-dialog.component';
import { Maintenance } from '@app/maintenance/domain/model/maintenance.entity';


@Component({
  selector: 'app-maintenence',
  imports: [],
  template: `
    <div class="w-full h-full p-10">
      <div>
        <h2 class="text-3xl font-bold mb-4">Mantenimientos Programados</h2>
        <div class="flex flex-col gap-4 mb-4">
          @for (maintenance of scheduledMaintenances; track maintenance.id) {
            <div class="bg-[#FF6B35] p-4 rounded-2xl">
              <div class="bg-white p-2 rounded-xl text-center">
                <p><strong>{{ format(maintenance.dateOfService, "DD/MM/YYYY h:mm", "es") }} - </strong>  {{ maintenance.location }}</p>
                <p><strong>Mecánico ID: {{ maintenance.mechanicId }}</strong> revisará el vehículo ID: {{maintenance.vehicleId}}</p>
                <p><strong>Motivo:</strong> {{maintenance.description}}</p>
              </div>
            </div>
          }
        </div>
      </div>
      <div>
        <h2 class="text-3xl font-bold mb-4">Mantenimientos Hechos</h2>
        <div class="flex flex-col gap-4 mb-4">
          @for (maintenance of completedMaintenances; track maintenance.id) {
            <div class="bg-[#FF6B35] p-4 rounded-2xl hover:bg-[#ff9169] transition-colors" (click)="openDialog(maintenance)">
              <div class="bg-white p-2 rounded-xl text-center">
                <p><strong>{{ format(maintenance.dateOfService, "DD/MM/YYYY h:mm", "es") }} - </strong>  {{ maintenance.location }}</p>
                <p><strong>Mecánico ID: {{ maintenance.mechanicId }}</strong> revisó el vehículo ID: {{maintenance.vehicleId}}</p>
                <p><strong>Detalles:</strong> {{maintenance.details}}</p>
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

  // Scheduled maintenances: state is PENDING or IN_PROGRESS, expense is null
  scheduledMaintenances: Maintenance[] = [
    {
      id: 1,
      details: "Revisión preventiva",
      vehicleId: 1,
      dateOfService: new Date().toISOString(),
      location: "Av. Rafael Escardo 201",
      description: "Fallo de tanque de gasolina",
      state: "PENDING",
      expense: null,
      mechanicId: 1
    },
    {
      id: 2,
      details: "Mantenimiento programado",
      vehicleId: 2,
      dateOfService: new Date().toISOString(),
      location: "Av. Rafael Escardo 201",
      description: "Revisión general de la moto",
      state: "IN_PROGRESS",
      expense: null,
      mechanicId: 1
    }
  ];

  // Completed maintenances: state is COMPLETED, expense is an Expense object with items
  completedMaintenances: Maintenance[] = [
    {
      id: 3,
      details: "Se cambiaron los neumáticos delanteros debido a una perforación en ambas.",
      vehicleId: 2,
      dateOfService: new Date().toISOString(),
      location: "Talambo 135, San Miguel 15087",
      description: "la moto piso una llave en el cilindro. no sufrió mayor daño",
      state: "COMPLETED",
      expense: {
        id: 1,
        name: "Neumáticos",
        finalPrice: 400,
        expenseType: "MAINTENANCE",
        items: [
          {
            id: 1,
            name: "Neumatico",
            amount: 2,
            unitPrice: 200,
            totalPrice: 400,
            itemType: "SUPPLIES"
          }
        ]
      },
      mechanicId: 1
    }
  ];

  protected readonly format = format;

  openDialog(maintenance: Maintenance) {
    this.dialog.open(MaintenanceDialogComponent, {
      data: {
        maintenance: maintenance
      }
    });
  }

}
