import {Component, ElementRef, HostListener, inject} from '@angular/core';
import {PendingAssignmentsDropdown} from '@app/assignments/presentation/components/pending-assignments-dropdown/pending-assignments-dropdown.component';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';

@Component({
  selector: 'app-pending-assignments-button',
  templateUrl: './pending-assignments-button.component.html',
  imports: [
    PendingAssignmentsDropdown
  ],
  styleUrls: ['./pending-assignments-button.component.css']
})
export class PendingAssignmentsButton {
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
