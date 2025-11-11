import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-role-selection',
  imports: [
    FormsModule
  ],
  templateUrl: './role-selection.page.html'
})
export class RoleSelectionPage {
  invitationCode: string = '';

  constructor(private router: Router) {}

  registerAsOwner() {
    const value = this.invitationCode?.trim();
    if (!value) return;
    this.router.navigate(['/sign-up'], {queryParams: {invitationCode: value}}).then();
   }

  registerAsMechanic(): void {
    this.router.navigate(['/sign-up']).then();
  }

}
