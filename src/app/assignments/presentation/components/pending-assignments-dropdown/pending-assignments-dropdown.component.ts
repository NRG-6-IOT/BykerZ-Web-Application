import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {
  PendingAssignmentsDropdownItem
} from '@app/assignments/presentation/components/pending-assignments-dropdown-item/pending-assignments-dropdown-item.component';

@Component({
  selector: 'app-pending-assignments-dropdown',
  templateUrl: './pending-assignments-dropdown.component.html',
  imports: [
    NgForOf,
    PendingAssignmentsDropdownItem
  ],
  styleUrls: ['./pending-assignments-dropdown.component.css']
})
export class PendingAssignmentsDropdown {
  @Input() assignments: Array<Assignment> = [];
}
