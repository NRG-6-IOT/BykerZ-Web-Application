import { Component } from '@angular/core';
import {NotificationButton} from '@app/assignments/presentation/components/notification-button/notification-button';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {AssignmentCardList} from '@app/assignments/presentation/components/assignment-card-list/assignment-card-list';
import {Owner} from '@app/assignments/domain/model/owner.entity';


@Component({
  selector: 'app-assignments-page',
  imports: [
    NotificationButton,
    AssignmentCardList
  ],
  templateUrl: './assignments-page.html',
  styleUrl: './assignments-page.css'
})
export class AssignmentsPage {
  assignments: Array<Assignment> = [];

  ngOnInit(): void {
    this.assignments = [
      new Assignment(1, 'Frequent Customer', new Owner(1, 'Ana Torres'), 2),
      new Assignment(2, 'Regular Customer', new Owner(2, 'Luis Pérez'), 1),
      new Assignment(3, 'Business Customer', new Owner(3, 'María Gómez'), 3),
      new Assignment(4, 'New Customer', new Owner(4, 'Carlos Ruiz'), 4),
      new Assignment(5, 'Occasional Customer', new Owner(5, 'Elena Díaz'), 2),
    ];
  }
}
