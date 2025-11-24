import { Component, Input } from '@angular/core';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {AssignmentCard} from '@app/assignments/presentation/components/assignment-card/assignment-card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-assignment-card-list',
  imports: [
    AssignmentCard,
    TranslatePipe
  ],
  templateUrl: './assignment-card-list.html',
  styleUrl: './assignment-card-list.css'
})
export class AssignmentCardList {
  @Input() assignments: Array<Assignment> = [];
}
