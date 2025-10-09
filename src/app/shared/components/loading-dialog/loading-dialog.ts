import { Component } from '@angular/core';
import {MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-dialog',
  imports: [
    MatDialogContent,
    MatProgressSpinner
  ],
  templateUrl: './loading-dialog.html',
  standalone: true,
  styleUrl: './loading-dialog.css'
})
export class LoadingDialog {
  constructor(private dialogRef: MatDialogRef<LoadingDialog>) {}
}
