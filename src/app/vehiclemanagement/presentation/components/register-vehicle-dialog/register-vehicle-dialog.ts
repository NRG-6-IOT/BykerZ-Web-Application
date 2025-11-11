import {Component, inject, OnInit} from '@angular/core';
import {MatDialogContent, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {NgOptimizedImage} from '@angular/common';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {Model} from '@app/vehiclemanagement/domain/model/vehicle.entity';

@Component({
  selector: 'app-register-vehicle-dialog',
  imports: [
    MatDialogContent,
    MatDialogModule,
    NgOptimizedImage,
    MatSelect,
    MatOption,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButton
  ],
  templateUrl: './register-vehicle-dialog.html',
  standalone: true,
  styleUrl: './register-vehicle-dialog.css'
})
export class RegisterVehicleDialog{

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
      "2024",
      "2023",
      "2022",
      "2021",
      "2020",
      "2019",
      "2018",
      "2017",
      "2016",
      "2015",
      "2014",
      "2013",
      "2012",
      "2011",
      "2010",
      "2009",
      "2008",
      "2007",
      "2006",
      "2005",
      "2004",
      "2003",
      "2002",
      "2001",
      "2000"
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
    return (this.brand != "" && this.model != null && this.year != "" && this.IsValidPlate(this.plate))
  }

  IsValidPlate(plate: string): boolean {
    const pattern = /^[0-9]{4}-[A-Z]{2}$/;
    return pattern.test(plate);
  }

  RegisterVehicle() {
    this.store.addVehicleToOwner(localStorage.getItem('role_id') ? +localStorage.getItem('role_id')! : 0, {
      plate: this.plate,
      year: this.year,
      modelId: this.model!.id
    });
    this.dialogRef.close();
  }
}
