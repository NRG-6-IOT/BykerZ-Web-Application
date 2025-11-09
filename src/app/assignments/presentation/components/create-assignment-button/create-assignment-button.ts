import {Component, inject} from '@angular/core';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';

@Component({
  selector: 'app-create-assignment-button',
  imports: [
  ],
  templateUrl: './create-assignment-button.html',
  styleUrl: './create-assignment-button.css'
})
export class CreateAssignmentButton {
  readonly store = inject(AssignmentsStore);

  openDialog() {
    this.store.createAssignment(1);
  }
}
