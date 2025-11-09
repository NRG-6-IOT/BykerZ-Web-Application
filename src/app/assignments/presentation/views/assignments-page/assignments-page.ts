import {Component, inject} from '@angular/core';
import {PendingAssignmentsButton} from '@app/assignments/presentation/components/pending-assignments-button/pending-assignments-button.component';
import {AssignmentCardList} from '@app/assignments/presentation/components/assignment-card-list/assignment-card-list';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {
  CreateAssignmentButton
} from '@app/assignments/presentation/components/create-assignment-button/create-assignment-button';


@Component({
  selector: 'app-assignments-page',
  imports: [
    PendingAssignmentsButton,
    AssignmentCardList,
    MatProgressSpinner,
    MatError,
    CreateAssignmentButton
  ],
  templateUrl: './assignments-page.html',
  styleUrl: './assignments-page.css'
})
export class AssignmentsPage {
  readonly store = inject(AssignmentsStore);

  get activeAssignments() {
    return this.store.activeAssignments();
  }


}
