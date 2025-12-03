import {Component, inject, OnInit, signal, Signal} from '@angular/core';
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {ActivatedRoute} from '@angular/router';
import {AssignmentsStore} from '@app/assignments/application/assigments.store';
import {
  AssignmentTypeSelector
} from '@app/assignments/presentation/components/assignment-type-selector/assignment-type-selector';
import {VehiclesStore} from '@app/vehiclemanagement/application/vehicles.store';
import {AssignVehicleCard} from '@app/assignments/presentation/components/assign-vehicle-card/assign-vehicle-card';
import {TranslatePipe} from '@ngx-translate/core';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {VehiclesApi} from '@app/vehiclemanagement/infrastructure/vehicles-api';

@Component({
  selector: 'app-assignment-detail-page',
  imports: [
    AssignmentTypeSelector,
    AssignVehicleCard,
    TranslatePipe
  ],
  templateUrl: './assignment-detail-page.html',
  styleUrl: './assignment-detail-page.css'
})
export class AssignmentDetailPage implements OnInit{
  private route = inject(ActivatedRoute);
  private store = inject(AssignmentsStore);
  private vehicleApi = inject(VehiclesApi);

  assignmentId: number | null = null;
  assignment: Assignment | null = null;
  ownerId: number  = 0;
  vehicles: Array<Vehicle> = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.assignmentId = params['id'] ? +params['id'] : null;
      if(this.assignmentId){
        const assignment = this.store.getAssignmentById(this.assignmentId)();
        if(assignment){
          this.assignment = assignment;
          this.ownerId = assignment.owner?.id || 0;
        }
      }
    })
    this.getVehicles();
  }

  private getVehicles(){
    this.vehicleApi.getVehiclesByOwnerId(this.ownerId).subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
      }
    });
  }

  handleTypeChange($event: string) {
    this.store.updateAssignmentType(this.assignmentId!, $event);
  }
}
