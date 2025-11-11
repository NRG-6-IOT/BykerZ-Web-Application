import { Routes } from '@angular/router';
import {DashboardOwnerPage} from '@app/public/presentation/views/dashboard-owner-page/dashboard-owner-page';
import {MaintenanceComponent} from '@app/wellness/pages/maintenence/maintenance.component';
import {ExpensesPageComponent} from '@app/wellness/pages/expenses-page/expenses-page.component';
import {ExpenseItemComponent} from '@app/wellness/components/expense-item/expense-item.component';
import {VehiclesPage} from '@app/vehiclemanagement/presentation/views/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from '@app/vehiclemanagement/presentation/views/vehicle-details-page/vehicle-details-page';
import {SignInPage} from '@app/iam/presentation/views/sign-in/sign-in.page';
import {SignUpPage} from '@app/iam/presentation/views/sign-up/sign-up.page';
import {DashboardMechanicPage} from '@app/public/presentation/views/dashboard-mechanic-page/dashboard-mechanic-page';
import {RoleSelectionPage} from '@app/iam/presentation/views/role-selection/role-selection.page';
import {VerifyOwner} from '@app/iam/presentation/views/verify-owner/verify-owner';
import {WellnessMetricPage} from '@app/metrics/presentation/views/wellness-metric-page/wellness-metric-page';

const assignmentsRoutes = () => import('@app/assignments/presentation/assignments.routes').then(m => m.assignmentsRoutes);

export const routes: Routes = [
  { path: '', redirectTo: "/sign-in", pathMatch: 'full' },
  { path: "selection", component: RoleSelectionPage },
  { path: "sign-in", component: SignInPage },
  { path: "sign-up", component: SignUpPage },
  { path: "verify", component: VerifyOwner },
  { path: "owner-dashboard", component: DashboardOwnerPage},
  { path: "mechanic-dashboard", component: DashboardMechanicPage},
  { path: "maintenances", component: MaintenanceComponent },
  { path: "compare", component: DashboardOwnerPage },
  { path: "expenses", component: ExpensesPageComponent },
  { path: "expenses/:id" , component: ExpenseItemComponent },
  { path: "assignments", loadChildren: assignmentsRoutes },
  { path: "membership", component: DashboardOwnerPage },
  { path: "vehicles", component: VehiclesPage },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage },
  {path: 'wellness-metrics',component: WellnessMetricPage}
];
