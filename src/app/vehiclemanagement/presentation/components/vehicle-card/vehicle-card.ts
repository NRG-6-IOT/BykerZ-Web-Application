import {Component, inject, Input} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';
import {Vehicle} from '../../../domain/model/vehicle.entity';
import {RouterLink} from '@angular/router';
import {AssignmentsStore} from "@app/assignments/application/assigments.store";

@Component({
  selector: 'app-vehicle-card',
  imports: [
    MatCard,
    NgOptimizedImage,
    MatCardContent,
    RouterLink
  ],
  templateUrl: './vehicle-card.html',
  standalone: true,
  styleUrl: './vehicle-card.css'
})
export class VehicleCard {
  @Input() vehicle!: Vehicle;

  private store = inject(AssignmentsStore);

  constructor() {
    this.store.getAssignmentByOwnerId(+localStorage.getItem('role_id')!);
  }

  get ownerAssignment() {
    return this.store.ownerAssignment();
  }
}
