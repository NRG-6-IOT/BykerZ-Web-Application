import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Assignment} from '@app/assignments/model/assignment.entity';
import {
  AssignmentCardDialog
} from '@app/assignments/components/assignment-card-dialog/assignment-card-dialog.component';

@Component({
  selector: 'app-assignment-card',
  imports: [],
  templateUrl: './assignment-card.component.html',
  styleUrl: './assignment-card.component.css'
})
export class AssignmentCard {
  @Input() assignment!: Assignment;

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AssignmentCardDialog, {
      data: { assignment: this.assignment }
    });
  }
}
