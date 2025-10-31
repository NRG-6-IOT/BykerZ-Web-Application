import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Assignment} from '@app/assignments/model/assignment.entity';
@Component({
  selector: 'app-Assignment-card-dialog',
  imports: [],
  templateUrl: './assignment-card-dialog.component.html',
  styleUrl: './assignment-card-dialog.component..css'
})
export class AssignmentCardDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { assignment: Assignment }) {}
  onClick(){

  }

}
