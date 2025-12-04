  import {Component, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {NgForOf, NgIf} from '@angular/common';
  import {LanguageSwitcherComponent} from '@app/shared/presentation/components/language-switcher/language-switcher';
  import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar-component',
  imports: [
    FormsModule,
    RouterLink,
    NgIf,
    NgForOf,
    LanguageSwitcherComponent,
    TranslatePipe,
    RouterLinkActive,
  ],
  templateUrl: './navbar-component.html',
  standalone: true,
  styleUrl: './navbar-component.css'
})
export class NavbarComponent implements OnInit {

  menuOptions: { name: string; route: string; translationKey: string }[] = [];

  selectedRole: string = '';
  isSignedIn: boolean = false;

  ownerOptions = [
    { name: 'Dashboard', route: '/owner-dashboard', translationKey: 'navbar.owner.dashboard' },
    { name: 'Vehicles', route: '/vehicles', translationKey: 'navbar.owner.vehicles' },
    { name: 'Comparatives', route: '/compare', translationKey: 'navbar.owner.comparatives' },
    { name: 'Expenses', route: '/expenses', translationKey: 'navbar.owner.expenses' },
    { name: 'Maintenance', route: '/maintenances/owner', translationKey: 'navbar.owner.maintenance' },
  ];

  mechanicOptions = [
    { name: 'Dashboard', route: '/mechanic-dashboard', translationKey: 'navbar.mechanic.dashboard' },
    { name: 'Assignments', route: '/assignments', translationKey: 'navbar.mechanic.assignments' },
    { name: 'Maintenance', route: '/maintenances/mechanic', translationKey: 'navbar.mechanic.maintenance' },
    { name: 'Comparatives', route: '/compare-mechanic', translationKey: 'navbar.mechanic.comparatives' },
    { name: 'Membership', route: '/membership', translationKey: 'navbar.mechanic.Membership' }
  ];

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.isSignedIn.subscribe((isSignedIn) => {
      this.isSignedIn = isSignedIn;
      if (isSignedIn) {
        this.loadRoleAndAssignOptions();
      } else {
        this.selectedRole = '';
        this.menuOptions = [];
      }
    });
  }

  ngOnInit() {
    this.loadRoleAndAssignOptions();
  }

  private async loadRoleAndAssignOptions() {
    const role = await this.GetRoleFromStorageWithRetry(5, 50);
    this.selectedRole = role;
    this.assignOptionsBasedOnRole();
  }

  async GetRoleFromStorageWithRetry(retries: number, delayMs: number): Promise<string> {
    for (let i = 0; i <= retries; i++) {
      const role = localStorage.getItem('user_role');
      if (role && role.trim().length > 0) {
        return role;
      }
      if (i < retries) {
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
    return ''; // no encontrado
  }

  assignOptionsBasedOnRole() {
    if (this.selectedRole === 'ROLE_OWNER') {
      this.menuOptions = this.ownerOptions;
    } else if (this.selectedRole === 'ROLE_MECHANIC') {
      this.menuOptions = this.mechanicOptions;
    } else {
      // no mostrar por defecto si no hay rol claro
      this.menuOptions = [];
    }
  }

  trackByName(_index: number, option: { name: string }): string {
    return option.name;
  }

  signOut() {
    localStorage.removeItem('user_role');
    this.authenticationService.signOut();
    this.selectedRole = '';
    this.menuOptions = [];
  }
}
