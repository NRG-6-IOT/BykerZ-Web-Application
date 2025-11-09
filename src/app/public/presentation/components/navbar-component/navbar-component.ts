import {Component, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {FormsModule} from '@angular/forms';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar-component',
  imports: [
    MatToolbar,
    FormsModule,
    RouterLink,
    NgIf,
    NgForOf,
  ],
  templateUrl: './navbar-component.html',
  standalone: true,
  styleUrl: './navbar-component.css'
})
export class NavbarComponent implements OnInit {

  menuOptions: { name: string; route: string }[] = [];

  selectedRole: string = '';
  isSignedIn: boolean = false;

  ownerOptions = [
    { name: 'Dashboard', route: '/owner-dashboard' },
    { name: 'Vehicles', route: '/vehicles' },
    { name: 'Maintenance', route: '/maintenances' },
    { name: 'Comparatives', route: '/compare' },
    { name: 'Expenses', route: '/expenses' }
  ];

  mechanicOptions = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Assignments', route: '/assignments' },
    { name: 'Maintenance', route: '/maintenances' },
    { name: 'Comparatives', route: '/compare' },
    { name: 'Membership', route: '/membership' }
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
