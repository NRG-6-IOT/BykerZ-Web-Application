import {Component, ElementRef, HostListener, inject} from '@angular/core';
import {NotificationDropdown} from '@app/assignments/presentation/components/notification-dropdown/notification-dropdown';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';

@Component({
  selector: 'app-notification-button',
  templateUrl: './notification-button.html',
  imports: [
    NotificationDropdown
  ],
  styleUrls: ['./notification-button.css']
})
export class NotificationButton {
  readonly store = inject(AssignmentsStore);
  open = false;
  constructor(private el: ElementRef<HTMLElement>) {}

  get pendingAssignments() {
    return this.store.pendingAssignments();
  }

  toggle(event: Event) {
    event.stopPropagation();
    this.open = !this.open;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: EventTarget | null) {
    // asegurarse de que target sea un Node antes de usar contains
    if (target instanceof Node && !this.el.nativeElement.contains(target)) {
      this.open = false;
    }
  }
}
