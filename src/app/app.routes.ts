import { Routes } from '@angular/router';
import {DashboardOwnerPage} from '@app/public/presentation/views/dashboard-owner-page/dashboard-owner-page';
import {MaintenanceComponent} from '@app/wellness/pages/maintenence/maintenance.component';
import {ExpensesPageComponent} from '@app/wellness/pages/expenses-page/expenses-page.component';
import {ExpenseItemComponent} from '@app/wellness/components/expense-item/expense-item.component';
import {VehiclesPage} from './vehiclemanagement/pages/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from './vehiclemanagement/pages/vehicle-details-page/vehicle-details-page';
import {SignInPage} from '@app/iam/presentation/views/sign-in/sign-in.page';
import {SignUpPage} from '@app/iam/presentation/views/sign-up/sign-up.page';
import {DashboardMechanicPage} from '@app/public/presentation/views/dashboard-mechanic-page/dashboard-mechanic-page';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {ComparePageComponent} from '@app/comparatives/pages/compare-page/compare-page.component';
import {CompareMechanicComponent} from '@app/comparatives/pages/compare-mechanic/compare-mechanic.component';

const assignmentsRoutes = () => import('@app/assignments/presentation/assignments.routes').then(m => m.assignmentsRoutes);

// Authentication guard function
const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isSignedIn) {
    return true;
  }

  router.navigate(['/sign-in']);
  return false;
};

export const routes: Routes = [
  { path: '', redirectTo: "/sign-in", pathMatch: 'full' },
  { path: "sign-in", component: SignInPage },
  { path: "sign-up", component: SignUpPage },
  { path: "owner-dashboard", component: DashboardOwnerPage, canActivate: [authGuard] },
  { path: "mechanic-dashboard", component: DashboardMechanicPage, canActivate: [authGuard] },
  { path: "maintenances", component: MaintenanceComponent, canActivate: [authGuard] },
  { path: "compare", component: ComparePageComponent, canActivate: [authGuard] },
  { path: "compare-owner", component: ComparePageComponent, canActivate: [authGuard] },
  { path: "compare-mechanic", component: CompareMechanicComponent, canActivate: [authGuard] },
  { path: "expenses", component: ExpensesPageComponent, canActivate: [authGuard] },
  { path: "expenses/:id" , component: ExpenseItemComponent, canActivate: [authGuard] },
  { path: "assignments", loadChildren: assignmentsRoutes, canActivate: [authGuard] },
  { path: "membership", component: DashboardOwnerPage, canActivate: [authGuard] },
  { path: "vehicles", component: VehiclesPage, canActivate: [authGuard] },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardOwnerPage, canActivate: [authGuard] },
];
