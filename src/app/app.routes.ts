import { Routes } from '@angular/router';
import {DashboardPage} from './public/pages/dashboard-page/dashboard-page';
import {VehiclesPage} from './vehiclemanagement/pages/vehicles-page/vehicles-page';
import {VehicleDetailsPage} from './vehiclemanagement/pages/vehicle-details-page/vehicle-details-page';

export const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: "dashboard", component: DashboardPage},
  { path: "maintenances", component: DashboardPage },
  { path: "compare", component: DashboardPage },
  { path: "expenses", component: DashboardPage },
  { path: "membership", component: DashboardPage },
  { path: "subscriptions", component: DashboardPage },
  { path: "vehicles", component: VehiclesPage },
  { path: "vehicle/:vehicleId", component: VehicleDetailsPage },
];
