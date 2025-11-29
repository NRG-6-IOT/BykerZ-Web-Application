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
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {VehicleCard} from '@app/vehiclemanagement/presentation/components/vehicle-card/vehicle-card';
import {AssignVehicleCard} from '@app/assignments/presentation/components/assign-vehicle-card/assign-vehicle-card';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    AssignmentTypeSelector,
    AssignVehicleCard
  ],
  templateUrl: './assignment-detail-page.html',
  styleUrl: './assignment-detail-page.css'
})
export class AssignmentDetailPage implements OnInit{
  private route = inject(ActivatedRoute);
  private store = inject(AssignmentsStore);
  private vehicleStore = inject(VehiclesStore);

  activeAssignments = this.store.activeAssignments;
  assignmentId: number | null = null;
  assignment: Assignment | null = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.assignmentId = params['id'] ? +params['id'] : null;
      if(this.assignmentId){
        const assignment = this.store.getAssignmentById(this.assignmentId)();
        if(assignment){
          this.assignment = assignment;
          this.vehicleStore.loadVehiclesByOwner(assignment.owner?.id!);
        }
      }
    })
  }

  handleTypeChange($event: string) {
    this.store.updateAssignmentType(this.assignmentId!, $event);
  }

  get vehicles() {
    return this.vehicleStore.vehicles();
  }
}
