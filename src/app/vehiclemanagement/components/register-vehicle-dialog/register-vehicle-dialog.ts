import {Component, OnInit} from '@angular/core';
import {MatDialogContent, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {NgOptimizedImage} from '@angular/common';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

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
export class RegisterVehicleDialog implements OnInit {

  brandOptions: string[];
  brand: string = "";

  modelOptions: string[];
  model: string = "";

  yearOptions: string[];
  year: string = "";

  plate: string = "";

  constructor(
    public dialogRef: MatDialogRef<RegisterVehicleDialog>
  ) {
    this.brandOptions = []
    this.modelOptions = []
    this.yearOptions = []
  }

  ngOnInit() {
    this.GetBrandOptions()
    this.GetYearOptions()
  }

  GetBrandOptions(): void {
    this.brandOptions = [
      "Honda",
      "Yamaha",
      "KTM"
    ];
  }

  GetModelOptions(): void {
    this.model = '';

    switch (this.brand) {
      case 'Honda':
        this.modelOptions = ['CB190R', 'CB125F', 'XR150'];
        break;
      case 'Yamaha':
        this.modelOptions = ['FZS 25', 'MT-03', 'R15'];
        break;
      case 'KTM':
        this.modelOptions = ['Duke 200', 'RC 125'];
        break;
      default:
        this.modelOptions = [];
        break;
    }
  }

  GetYearOptions(): void {
    this.yearOptions = [
      "2024",
      "2023",
      "2022",
      "2021",
      "2020",
    ];
  }

  CloseDialog() {
    this.dialogRef.close();
  }

  IsValid(): boolean {
    return (this.brand != "" && this.model != "" && this.year != "" && this.IsValidPlate(this.plate))
  }

  IsValidPlate(plate: string): boolean {
    const pattern = /^[0-9]{4}-[A-Z]{2}$/;
    return pattern.test(plate);
  }
}
