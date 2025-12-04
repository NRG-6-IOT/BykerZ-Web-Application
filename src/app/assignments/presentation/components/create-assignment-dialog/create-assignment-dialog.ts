import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-create-assignment-dialog',
  imports: [
    TranslatePipe
  ],
  templateUrl: './create-assignment-dialog.html',
  styleUrl: './create-assignment-dialog.css'
})
export class CreateAssignmentDialog {
  readonly store = inject(AssignmentsStore);
  @Output() close = new EventEmitter<void>();

  get createdAssigment() {
    return this.store.createdAssignment();
  }

  onClose() {
    this.close.emit();
  }
}
