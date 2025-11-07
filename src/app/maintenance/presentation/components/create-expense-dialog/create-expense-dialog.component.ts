import {Component, inject, model} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-create-expense-dialog',
  imports: [
    MatDialogModule,
    MatFormField,
    MatInput,
    MatButton,
    FormsModule,
    MatFormField,
    MatLabel
  ],
  template: `
    <div class="bg-white">
      <h2 mat-dialog-title>Hi {{data.name}}</h2>
      <mat-dialog-content>
        <p>What's your favorite animal?</p>
        <mat-form-field>
          <mat-label>Favorite Animal</mat-label>
          <input matInput [(ngModel)]="animal" />
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button matButton (click)="onCloseClick()">No Thanks</button>
        <button matButton [mat-dialog-close]="animal()" cdkFocusInitial>Ok</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: ``,
})
export class CreateExpenseDialogComponent {
  readonly dialogRef = inject(MatDialogRef<CreateExpenseDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly animal = model(this.data.animal);

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
