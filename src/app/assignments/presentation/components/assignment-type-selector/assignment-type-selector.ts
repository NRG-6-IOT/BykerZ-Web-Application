import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-assignment-type-selector',
  imports: [
    FormsModule,
    NgForOf,
    TranslatePipe
  ],
  templateUrl: './assignment-type-selector.html',
  styleUrl: './assignment-type-selector.css'
})
export class AssignmentTypeSelector {
  @Input() assignmentType: string | undefined = undefined;
  @Output() typeChanged = new EventEmitter<string>();

  assignmentTypes: string[] = ['UNCATEGORIZED', 'REGULAR', 'FREQUENT', 'BUSINESS'];

  capitalize(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }

  onTypeChange($event: Event) {
    const selectedType = ($event.target as HTMLSelectElement).value;
    this.typeChanged.emit(selectedType);
  }
}
