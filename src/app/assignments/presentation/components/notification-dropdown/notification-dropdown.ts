import { Component, Input } from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-notification-dropdown',
  templateUrl: './notification-dropdown.html',
  imports: [
    NgForOf
  ],
  styleUrls: ['./notification-dropdown.css']
})
export class NotificationDropdown {
  @Input() items: string[] = [
    'Notificación 1',
    'Notificación 2',
    'Notificación 3'
  ];
}
