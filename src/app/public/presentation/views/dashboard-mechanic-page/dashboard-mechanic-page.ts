import { Component } from '@angular/core';
import {
  AssignmentTypeSelector
} from '@app/assignments/presentation/components/assignment-type-selector/assignment-type-selector';

@Component({
  selector: 'app-dashboard-mechanic-page',
  imports: [
    AssignmentTypeSelector
  ],
  templateUrl: './dashboard-mechanic-page.html',
  standalone: true,
  styleUrl: './dashboard-mechanic-page.css'
})
export class DashboardMechanicPage {

}
