import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';

@Component({
  selector: 'app-notification-dropdown-item',
  imports: [
  ],
  templateUrl: './notification-dropdown-item.html',
  styleUrl: './notification-dropdown-item.css'
})
export class NotificationDropdownItem {
  @Input() assignment?: Assignment;
  @Output() select = new EventEmitter<Assignment>();

  onClick() {
    if (this.assignment) {
      this.select.emit(this.assignment);
    }
  }

  formatDate(dateInput?: string | Date | null): string {
    if (!dateInput) { return ''; }
    const date = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
    if (isNaN(date.getTime())) { return ''; }
    return new Intl.DateTimeFormat('en-EN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  }
}
