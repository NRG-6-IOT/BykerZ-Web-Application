import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '@app/shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-role-selection',
  imports: [
    FormsModule,
    TranslatePipe,
    LanguageSwitcherComponent
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
