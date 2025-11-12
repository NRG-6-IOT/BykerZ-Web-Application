import {Routes} from '@angular/router';

const OwnerMaintenancePage = () => import('./views/owner-maintenance-page/owner-maintenance-page').then(m => m.OwnerMaintenancePage);
const MechanicMaintenancePage = () => import('./views/mechanic-maintenance-page/mechanic-maintenance-page').then(m => m.MechanicMaintenancePage);
const CreateMaintenancePage = () => import('./views/create-maintenance-page/create-maintenance-page').then(m => m.CreateMaintenancePage);

export const maintenanceRoutes : Routes = [
  { path: "owner", loadComponent: OwnerMaintenancePage },
  { path: "mechanic", loadComponent: MechanicMaintenancePage },
  { path: "mechanic/create", loadComponent: CreateMaintenancePage }
];
