import {Routes} from '@angular/router';


const ExpensesPage = () => import('./views/owner-expenses-page/owner-expenses-page').then(m => m.OwnerExpensesPage);
const ExpenseDetailPage = () => import('./views/expenses-detail-page/expenses-detail-page').then(m => m.ExpensesDetailPage);

export const expenseRoutes : Routes = [
  { path: "" , loadComponent: ExpensesPage },
  { path: ":id" , loadComponent: ExpenseDetailPage }
]
