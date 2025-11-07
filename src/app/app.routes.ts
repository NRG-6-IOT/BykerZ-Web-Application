import { Routes } from '@angular/router';
import {DashboardPage} from './public/pages/dashboard-page/dashboard-page';
import {MaintenanceComponent} from '@app/wellness/pages/maintenence/maintenance.component';
import {ExpensesPageComponent} from '@app/wellness/pages/expenses-page/expenses-page.component';
import {ExpenseItemComponent} from '@app/wellness/components/expense-item/expense-item.component';
import {VehiclesPage} from './vehiclemanagement/pages/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from './vehiclemanagement/pages/vehicle-details-page/vehicle-details-page';
import {SignInPage} from '@app/iam/pages/sign-in/sign-in.page';
import {SignUpPage} from '@app/iam/pages/sign-up/sign-up.page';
import {authenticationGuard} from '@app/iam/services/authentication.guard';

const assignmentsRoutes = () => import('@app/assignments/presentation/assignments.routes').then(m => m.assignmentsRoutes);

export const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: "sign-in", component: SignInPage },
  { path: "sign-up", component: SignUpPage },
  { path: "dashboard", component: DashboardPage},
  { path: "maintenances", component: MaintenanceComponent },
  { path: "compare", component: DashboardPage },
  { path: "expenses", component: ExpensesPageComponent },
  { path: "expenses/:id" , component: ExpenseItemComponent },
  { path: "assignments", loadChildren: assignmentsRoutes },
  { path: "membership", component: DashboardPage },
  { path: "vehicles", component: VehiclesPage },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage },
];
