import { Component, ElementRef, HostListener } from '@angular/core';
import { NotificationDropdownComponent } from '@app/subscription/components/notification-dropdown/notification-dropdown.component';

@Component({
  selector: 'app-notification-button',
  templateUrl: './notification-button.component.html',
  imports: [
    NotificationDropdownComponent
  ],
  styleUrls: ['./notification-button.component.css']
})
export class NotificationButtonComponent {
  open = false;
  constructor(private el: ElementRef<HTMLElement>) {}

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
