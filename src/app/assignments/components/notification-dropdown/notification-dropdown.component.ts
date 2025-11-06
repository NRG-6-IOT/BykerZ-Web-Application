import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.component.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./notification-dropdown.component.css']
})
export class NotificationDropdown {
  @Input() items: string[] = [
    'Notificación 1',
    'Notificación 2',
    'Notificación 3'
  ];
}
