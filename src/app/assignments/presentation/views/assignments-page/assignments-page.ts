import {Component, inject} from '@angular/core';
import {NotificationButton} from '@app/assignments/presentation/components/notification-button/notification-button';
import {AssignmentCardList} from '@app/assignments/presentation/components/assignment-card-list/assignment-card-list';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';


@Component({
  selector: 'app-assignments-page',
  imports: [
    NotificationButton,
    AssignmentCardList,
    MatProgressSpinner,
    MatError
  ],
  templateUrl: './assignments-page.html',
  styleUrl: './assignments-page.css'
})
export class AssignmentsPage {
  readonly store = inject(AssignmentsStore);

  get assignments() {
    return this.store.assignments();
  }

}
