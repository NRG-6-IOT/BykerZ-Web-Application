import {Component, OnInit} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [
    MatToolbar,
    MatButtonToggleGroup,
    MatButtonToggle,
    FormsModule,
    MatButton,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar-component.html',
  standalone: true,
  styleUrl: './navbar-component.css'
})
export class NavbarComponent implements OnInit {

  roleOptions = [
    { name: 'Dueño', value: 'Owner'},
    { name: 'Mecánico', value: 'Mechanic'}
  ];
  selectedRole: string = "Owner";

  ownerOptions = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Vehículos', route: '/vehicles' },
    { name: 'Mantenimientos', route: '/maintenances' },
    { name: 'Comparativas', route: '/compare' },
    { name: 'Gastos', route: '/expenses' }
  ];

  mechanicOptions = [
    { name: 'Dashboard', route: '/dashboard' },
    { name: 'Suscripciones', route: '/subscriptions' },
    { name: 'Mantenimientos', route: '/maintenances' },
    { name: 'Comparativas', route: '/compare' },
    { name: 'Membresía', route: '/membership' }
  ];

  ngOnInit() {
    this.selectedRole = this.GetRoleFromStorage();
  }

  SetRoleInStorage(role: string) {
    if (this.selectedRole !== role) {
      this.selectedRole = role;
    }
    localStorage.setItem('user_role', JSON.stringify(role));
  }

  GetRoleFromStorage(): string {
    return JSON.parse(localStorage.getItem('user_role') || '"Owner"');
  }


}
