import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {
  AssignmentCardDialog
} from '@app/assignments/presentation/components/assignment-card-dialog/assignment-card-dialog';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-assignment-card',
  imports: [
    TranslatePipe
  ],
  templateUrl: './assignment-card.html',
  styleUrl: './assignment-card.css'
})
export class AssignmentCard {
  private _assignment?: Assignment;

  @Input()
  set assignment(value: Assignment | undefined) {
    this._assignment = value;
    this.formattedDate = this.formatDate(value?.createdAtDate);
    this.formattedType = this.formatType(value?.type);
  }
  get assignment(): Assignment | undefined {
    return this._assignment;
  }

  formattedDate = '';
  formattedType = '';

  constructor(private dialog: MatDialog, private router: Router) {}

  openDialog() {
    if (!this._assignment) { return; }
    this.dialog.open(AssignmentCardDialog, {
      data: { assignment: this._assignment }
    });
  }

  // Formatea la fecha de forma segura y consistente para locale es-ES.
  formatDate(dateInput?: string | Date | null): string {
    if (!dateInput) { return ''; }
    const date = typeof dateInput === 'string' ? new Date(dateInput) : new Date(dateInput);
    if (isNaN(date.getTime())) { return ''; }
    return new Intl.DateTimeFormat('en-EN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }

  formatType(typeInput?: string | null): string {
    if (!typeInput) { return ''; }
    switch (typeInput) {
      case 'UNCATEGORIZED':
        return 'Uncategorized Customer';
      case 'REGULAR':
        return 'Regular Customer';
      case 'FREQUENT':
        return 'Frequent Customer';
      case 'BUSINESS':
        return 'Business Customer';
      default:
        return typeInput;
    }
  }

  redirectToDetails() {
    if (!this._assignment) { return; }
    this.router.navigate(['/assignments', this._assignment.id], { state: { assignment: this._assignment } });
  }
}
