import {Component, inject, OnInit} from '@angular/core';
import {MatDialogContent, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {NgOptimizedImage} from '@angular/common';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {Model} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import { CommonModule } from '@angular/common'; // Agregado para *ngIf

@Component({
  selector: 'app-register-vehicle-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    NgOptimizedImage,
    MatSelect,
    MatOption,
    FormsModule,
    MatSelectModule,
    MatInputModule,
  ],
  templateUrl: './register-vehicle-dialog.html',
  standalone: true,
  styleUrl: './register-vehicle-dialog.css'
})
export class RegisterVehicleDialog {

  private store = inject(VehiclesStore);

  brand: string = "";
  modelOptions: Model[];
  model: Model | null = null;
  yearOptions: String[];
  year: string = "";
  plate: string = "";

  constructor(
    public dialogRef: MatDialogRef<RegisterVehicleDialog>
  ) {
    this.modelOptions = [];
    this.yearOptions = [
      "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017",
      "2016", "2015", "2014", "2013", "2012", "2011", "2010"
    ];
  }

  get brandOptions() {
    return this.store.brands();
  }

  GetModelOptions(): void {
    this.model = null;
    this.modelOptions = this.store.getModelsByBrand(this.brand)();
  }

  CloseDialog() {
    this.dialogRef.close();
  }

  IsValid(): boolean {
    // Verificación más robusta
    const validBrand = this.brand && this.brand.trim() !== "";
    const validModel = this.model != null;
    const validYear = this.year && this.year.trim() !== "";
    const validPlate = this.IsValidPlate(this.plate);

    return !!(validBrand && validModel && validYear && validPlate);
  }

  IsValidPlate(plate: string): boolean {
    if (!plate) return false;
    // Permitir a-z minúsculas también para mejor UX
    const pattern = /^[0-9]{4}-[a-zA-Z]{2}$/;
    return pattern.test(plate);
  }

  RegisterVehicle() {
    if (!this.IsValid()) return;

    // Convertir placa a mayúsculas antes de enviar
    const formattedPlate = this.plate.toUpperCase();

    this.store.addVehicleToOwner(localStorage.getItem('role_id') ? +localStorage.getItem('role_id')! : 0, {
      plate: formattedPlate,
      year: this.year,
      modelId: this.model!.id
    });

    // Pequeño timeout para verificar errores del store, aunque idealmente el store manejaría esto reactivamente
    setTimeout(() => {
      if (this.store.error() != null) {
        alert(this.store.error());
      } else {
        // Asumimos éxito si no hay error inmediato (o puedes suscribirte al store success)
        alert('Vehicle registered successfully');
        this.dialogRef.close();
      }
    }, 200);
  }
}
