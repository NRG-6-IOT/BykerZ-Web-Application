import {Component, inject, OnInit} from '@angular/core';
import {PendingAssignmentsButton} from '@app/assignments/presentation/components/pending-assignments-button/pending-assignments-button.component';
import {AssignmentCardList} from '@app/assignments/presentation/components/assignment-card-list/assignment-card-list';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {
  CreateAssignmentButton
} from '@app/assignments/presentation/components/create-assignment-button/create-assignment-button';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-assignments-page',
  imports: [
    PendingAssignmentsButton,
    AssignmentCardList,
    MatProgressSpinner,
    CreateAssignmentButton,
    TranslatePipe
  ],
  templateUrl: './assignments-page.html',
  styleUrl: './assignments-page.css'
})
export class AssignmentsPage implements OnInit{
  readonly store = inject(AssignmentsStore);

  ngOnInit() {
    this.store.reload()
  }

  get activeAssignments() {
    return this.store.activeAssignments();
  }


}
