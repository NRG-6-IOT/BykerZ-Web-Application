import {Component, inject, OnInit} from '@angular/core';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';

@Component({
  selector: 'app-dashboard-owner-page',
  standalone: true,
  templateUrl: './dashboard-owner-page.html',
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
