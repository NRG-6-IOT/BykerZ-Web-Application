import { Routes } from '@angular/router';
import {DashboardPage} from '@app/public/presentation/views/dashboard-page/dashboard-page';
import {MaintenanceComponent} from '@app/wellness/pages/maintenence/maintenance.component';
import {ExpensesPageComponent} from '@app/wellness/pages/expenses-page/expenses-page.component';
import {ExpenseItemComponent} from '@app/wellness/components/expense-item/expense-item.component';
import {VehiclesPage} from './vehiclemanagement/pages/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from './vehiclemanagement/pages/vehicle-details-page/vehicle-details-page';
import {SubscriptionPage} from './subscription/pages/subscription-page/subscription-page';
import {SignInPage} from '@app/iam/pages/sign-in/sign-in.page';
import {SignUpPage} from '@app/iam/pages/sign-up/sign-up.page';
import {authenticationGuard} from '@app/iam/services/authentication.guard';

export const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: "sign-in", component: SignInPage },
  { path: "sign-up", component: SignUpPage },
  { path: "dashboard", component: DashboardPage, canActivate: [authenticationGuard] },
  { path: "maintenances", component: MaintenanceComponent, canActivate: [authenticationGuard] },
  { path: "compare", component: DashboardPage, canActivate: [authenticationGuard] },
  { path: "expenses", component: ExpensesPageComponent, canActivate: [authenticationGuard] },
  { path: "expenses/:id" , component: ExpenseItemComponent, canActivate: [authenticationGuard] },
  { path: "membership", component: DashboardPage, canActivate: [authenticationGuard] },
  { path: "subscriptions", component: SubscriptionPage, canActivate: [authenticationGuard] },
  { path: "vehicles", component: VehiclesPage, canActivate: [authenticationGuard] },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage, canActivate: [authenticationGuard] },
];
