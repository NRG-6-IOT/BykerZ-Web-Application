import { Routes } from '@angular/router';
import {DashboardPage} from './public/pages/dashboard-page/dashboard-page';
import {MaintenanceComponent} from '@app/maintenance/presentation/pages/maintenence/maintenance.component';
import {VehiclesPage} from './vehiclemanagement/pages/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from './vehiclemanagement/pages/vehicle-details-page/vehicle-details-page';
import {SubscriptionPage} from './subscription/pages/subscription-page/subscription-page';
import {SignInPage} from '@app/iam/pages/sign-in/sign-in.page';
import {SignUpPage} from '@app/iam/pages/sign-up/sign-up.page';
import {authenticationGuard} from '@app/iam/services/authentication.guard';
import {
  OwnerExpensesPageComponent
} from '@app/maintenance/presentation/views/owner-expenses-page/owner-expenses-page.component';
import {
  OwnerExpenseDetailsPageComponent
} from '@app/maintenance/presentation/views/owner-expense-details-page/owner-expense-details-page.component';
import {
  OwnerMaintenancePageComponent
} from '@app/maintenance/presentation/views/owner-maintenance-page/owner-maintenance-page.component';

export const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: "sign-in", component: SignInPage },
  { path: "sign-up", component: SignUpPage },
  { path: "dashboard", component: DashboardPage, canActivate: [authenticationGuard] },
  { path: "maintenances", component: MaintenanceComponent, canActivate: [authenticationGuard] },
  { path: "compare", component: DashboardPage, canActivate: [authenticationGuard] },
  { path: "membership", component: DashboardPage, canActivate: [authenticationGuard] },
  { path: "subscriptions", component: SubscriptionPage, canActivate: [authenticationGuard] },
  { path: "vehicles", component: VehiclesPage, canActivate: [authenticationGuard] },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage, canActivate: [authenticationGuard] },
  { path: "expenses" ,component: OwnerExpensesPageComponent , canActivate: [authenticationGuard] },
  { path: "expenses/:expenseId", component: OwnerExpenseDetailsPageComponent, canActivate: [authenticationGuard]},
  { path: "owner/maintenance" ,component: OwnerMaintenancePageComponent , canActivate: [authenticationGuard] },
  //{ path: "owner/maintenance"},
  //{ path: "mechanic/maintenance" },
];
