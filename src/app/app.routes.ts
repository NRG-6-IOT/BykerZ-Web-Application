import { Routes } from '@angular/router';
import {DashboardPage} from './public/pages/dashboard-page/dashboard-page';
import {MaintenanceComponent} from '@app/wellness/pages/maintenence/maintenance.component';
import {ExpensesPageComponent} from '@app/wellness/pages/expenses-page/expenses-page.component';
import {ExpenseItemComponent} from '@app/wellness/components/expense-item/expense-item.component';
import {VehiclesPage} from './vehiclemanagement/pages/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from './vehiclemanagement/pages/vehicle-details-page/vehicle-details-page';
import {SubscriptionPage} from './subscription/pages/subscription-page/subscription-page';
import { ComparePageComponent } from './comparatives/pages/compare-page/compare-page.component';
import {CompareMechanicComponent} from '@app/comparatives/pages/compare-mechanic/compare-mechanic.component';

export const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: "dashboard", component: DashboardPage},
  { path: "maintenances", component: MaintenanceComponent },
  { path: "compare", component: ComparePageComponent },
  { path: "compare/mechanic", component: CompareMechanicComponent },
  { path: "expenses", component: ExpensesPageComponent },
  { path: "expenses/:id" , component: ExpenseItemComponent },
  { path: "membership", component: DashboardPage },
  { path: "subscriptions", component: SubscriptionPage },
  { path: "vehicles", component: VehiclesPage },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage },
];
