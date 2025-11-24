import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-pending-assignments-dropdown-item',
  imports: [
    TranslatePipe
  ],
  templateUrl: './pending-assignments-dropdown-item.component.html',
  styleUrl: './pending-assignments-dropdown-item.component.css'
})
export class PendingAssignmentsDropdownItem {
  readonly store = inject(AssignmentsStore);
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

  deleteAssignment() {
    this.store.deleteAssignment(this.assignment?.id!);
  }
}
