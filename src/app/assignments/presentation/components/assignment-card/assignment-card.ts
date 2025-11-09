import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {
  AssignmentCardDialog
} from '@app/assignments/presentation/components/assignment-card-dialog/assignment-card-dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-assignment-card',
  imports: [],
  templateUrl: './assignment-card.html',
  styleUrl: './assignment-card.css'
})
export class AssignmentCard {
  @Input() assignment!: Assignment;

  constructor(private dialog: MatDialog, private router: Router) {}

  openDialog() {
    this.dialog.open(AssignmentCardDialog, {
      data: { assignment: this.assignment }
    });
  }

  redirectToDetails() {
    if (!this.assignment) { return; }
    // Navega a /assignments/:id y pasa el objeto assignment en navigation state
    this.router.navigate(['/assignments', this.assignment.id], { state: { assignment: this.assignment } });
  }
}
