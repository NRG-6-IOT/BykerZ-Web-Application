import { Component } from '@angular/core';
import {MatDialog, MatDialogContainer, MatDialogContent, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-register-vehicle-dialog',
  imports: [
    MatDialogContainer,
    MatDialogContent,
    MatDialogModule,
  ],
  templateUrl: './register-vehicle-dialog.html',
  standalone: true,
  styleUrl: './register-vehicle-dialog.css'
})
export class RegisterVehicleDialog {

  constructor(
    public dialogRef: MatDialogRef<RegisterVehicleDialog>
  ) {

  }

  CloseDialog() {
    this.dialogRef.close();
  }
}
