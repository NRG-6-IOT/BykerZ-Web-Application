import { Routes } from '@angular/router';
import {DashboardOwnerPage} from '@app/public/presentation/views/dashboard-owner-page/dashboard-owner-page';
import {VehiclesPage} from '@app/vehiclemanagement/presentation/views/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from '@app/vehiclemanagement/presentation/views/vehicle-details-page/vehicle-details-page';
import {SignInPage} from '@app/iam/presentation/views/sign-in/sign-in.page';
import {SignUpPage} from '@app/iam/presentation/views/sign-up/sign-up.page';
import {DashboardMechanicPage} from '@app/public/presentation/views/dashboard-mechanic-page/dashboard-mechanic-page';
import {RoleSelectionPage} from '@app/iam/presentation/views/role-selection/role-selection.page';
import {VerifyOwner} from '@app/iam/presentation/views/verify-owner/verify-owner';
import {WellnessMetricPage} from '@app/vehicle-wellness/presentation/views/wellness-metric-page/wellness-metric-page';
import {ComparePageComponent} from '@app/comparatives/pages/compare-page/compare-page.component';
import {CompareMechanicComponent} from '@app/comparatives/pages/compare-mechanic/compare-mechanic.component';

const assignmentsRoutes = () => import('@app/assignments/presentation/assignments.routes').then(m => m.assignmentsRoutes);
const expensesRoutes = () => import('@app/maintenance-and-operations/presentation/expense.routes').then(m => m.expenseRoutes);
const maintenanceRoutes = () => import('@app/maintenance-and-operations/presentation/maintenance.routes').then(m => m.maintenanceRoutes);

export const routes: Routes = [
  { path: '', redirectTo: "/sign-in", pathMatch: 'full' },
  { path: "selection", component: RoleSelectionPage },
  { path: "sign-in", component: SignInPage },
  { path: "sign-up", component: SignUpPage },
  { path: "verify", component: VerifyOwner },
  { path: "owner-dashboard", component: DashboardOwnerPage},
  { path: "mechanic-dashboard", component: DashboardMechanicPage},
  { path: "compare", component: ComparePageComponent },
  { path: "compare-mechanic", component: CompareMechanicComponent },
  { path: "assignments", loadChildren: assignmentsRoutes },
  { path: "maintenances", loadChildren: maintenanceRoutes },
  { path : "expenses", loadChildren: expensesRoutes},
  { path: "membership", component: DashboardOwnerPage },
  { path: "vehicles", component: VehiclesPage },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage },
  {path: 'wellness-metrics',component: WellnessMetricPage}
];
