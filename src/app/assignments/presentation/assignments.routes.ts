import {Routes} from '@angular/router';

//lazy load components
const AssignmentPage = () => import('./views/assignments-page/assignments-page').then(m => m.AssignmentsPage);
const AssignmentDetailPage = () => import('./views/assignment-detail-page/assignment-detail-page').then(m => m.AssignmentDetailPage);

export const assignmentsRoutes: Routes =[
  { path: "", loadComponent: AssignmentPage },
  { path: ":id", loadComponent: AssignmentDetailPage }
]
