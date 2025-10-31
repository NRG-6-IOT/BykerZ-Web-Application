import { Component } from '@angular/core';
import {
  NotificationButtonComponent
} from '@app/assignments/components/notification-button/notification-button.component';
import {Assignment, Owner} from '@app/assignments/model/assignment.entity';
import {AssignmentCardList} from '@app/assignments/components/assignment-card-list/assignment-card-list.component';


@Component({
  selector: 'app-assignment-page',
  imports: [
    NotificationButtonComponent,
    AssignmentCardList
  ],
  templateUrl: './assignment-page.component.html',
  styleUrl: './assignment-page.component.css'
})
export class AssignmentPage {
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
