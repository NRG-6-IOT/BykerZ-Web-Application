import {Component, inject} from '@angular/core';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {
  CreateAssignmentDialog
} from '@app/assignments/presentation/components/create-assignment-dialog/create-assignment-dialog';

@Component({
  selector: 'app-create-assignment-button',
  imports: [
    CreateAssignmentDialog
  ],
  templateUrl: './create-assignment-button.html',
  styleUrl: './create-assignment-button.css'
})
export class CreateAssignmentButton {
  readonly store = inject(AssignmentsStore);
  showDialog = false;

  openDialog() {
    this.store.createAssignment(Number(localStorage.getItem('role_id')));
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }
}
