import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {
  NotificationDropdownItem
} from '@app/assignments/presentation/components/notification-dropdown-item/notification-dropdown-item';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.html',
  imports: [
    NgForOf,
    NotificationDropdownItem
  ],
  styleUrls: ['./notification-dropdown.css']
})
export class NotificationDropdown {
  @Input() assignments: Array<Assignment> = [];
}
