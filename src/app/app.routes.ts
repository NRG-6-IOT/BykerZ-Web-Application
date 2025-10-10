import { Routes } from '@angular/router';
import {DashboardPage} from './public/pages/dashboard-page/dashboard-page';
import {MaintenanceComponent} from '@app/wellness/pages/maintenence/maintenance.component';
import {ExpensesPageComponent} from '@app/wellness/pages/expenses-page/expenses-page.component';
import {ExpenseItemComponent} from '@app/wellness/components/expense-item/expense-item.component';

export const routes: Routes = [
  { path: '', redirectTo: "/dashboard", pathMatch: 'full' },
  { path: "dashboard", component: DashboardPage},
  { path: "maintenances", component: MaintenanceComponent },
  { path: "compare", component: DashboardPage },
  { path: "expenses", component: ExpensesPageComponent },
  {path: "expenses/:id" , component: ExpenseItemComponent },
  { path: "membership", component: DashboardPage },
  { path: "subscriptions", component: DashboardPage },
  { path: "vehicles", component: DashboardPage },
];
