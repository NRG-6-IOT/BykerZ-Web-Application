import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
@Component({
  selector: 'app-Assignment-card-dialog',
  imports: [],
  templateUrl: './assignment-card-dialog.html',
  styleUrl: './assignment-card-dialog.css'
})
export class AssignmentCardDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { assignment: Assignment }) {}
  onClick(){

  }

}
