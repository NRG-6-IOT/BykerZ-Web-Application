import {Component, inject, OnInit} from '@angular/core';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {ActivatedRoute} from '@angular/router';
import {
  AssignmentCardDialog
} from '@app/assignments/presentation/components/assignment-card-dialog/assignment-card-dialog';
import {MatDialog} from '@angular/material/dialog';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {
  AssignmentTypeSelector
} from '@app/assignments/presentation/components/assignment-type-selector/assignment-type-selector';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    AssignmentTypeSelector

  ],
  templateUrl: './assignment-detail-page.html',
  styleUrl: './assignment-detail-page.css'
})
export class AssignmentDetailPage{
  private route = inject(ActivatedRoute);
  private store = inject(AssignmentsStore);

  activeAssignments = this.store.activeAssignments;
  assignmentId: number | null = null;
  assignment: Assignment | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.assignmentId = params['id'] ? +params['id'] : null;
      if(this.assignmentId){
        const assignment = this.store.getAssignmentById(this.assignmentId)();
        if(assignment){
          this.assignment = assignment;
        }
      }
    })
  }

  handleTypeChange($event: string) {
    this.store.updateAssignmentType(this.assignmentId!, $event);
  }
}
