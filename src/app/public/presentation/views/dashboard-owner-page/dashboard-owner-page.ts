import {Component, inject, OnInit} from '@angular/core';
import {
  AssignmentTypeSelector
} from '@app/assignments/presentation/components/assignment-type-selector/assignment-type-selector';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';

@Component({
  selector: 'app-dashboard-owner-page',
  imports: [
    AssignmentTypeSelector
  ],
  templateUrl: './dashboard-owner-page.html',
  standalone: true,
  styleUrl: './dashboard-owner-page.css'
})
export class DashboardOwnerPage implements OnInit {
  private store = inject(AssignmentsStore);

  ngOnInit() {
    this.store.getAssignmentByOwnerId(1);
  }

  get ownerAssignment() {
    return this.store.ownerAssignment;
  }
}
