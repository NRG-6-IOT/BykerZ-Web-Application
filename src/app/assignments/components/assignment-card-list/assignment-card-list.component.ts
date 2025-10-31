import { Component, Input } from '@angular/core';
import {Assignment} from '@app/assignments/model/assignment.entity';
import {AssignmentCard} from '@app/assignments/components/assignment-card/assignment-card.component';

@Component({
  selector: 'app-assignment-card-list',
  imports: [
    AssignmentCard
  ],
  templateUrl: './assignment-card-list.component.html',
  styleUrl: './assignment-card-list.component.css'
})
export class AssignmentCardList {
  @Input() assignments: Array<Assignment> = [];
}
