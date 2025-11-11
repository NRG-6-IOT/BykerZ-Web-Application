import {Component, inject, OnInit} from '@angular/core';
import {Model, Vehicle} from '../../../domain/model/vehicle.entity';
import {ActivatedRoute} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {VehiclesStore} from "@app/vehiclemanagement/application/vehicles.store";

@Component({
  selector: 'app-vehicle-details-page',
  imports: [
    NgOptimizedImage,
    MatCard
  ],
  templateUrl: './vehicle-details-page.html',
  standalone: true,
  styleUrl: './vehicle-details-page.css'
})
export class VehicleDetailsPage {
  private route = inject(ActivatedRoute);
  private store = inject(VehiclesStore);

  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.vehicleId = params['vehicleId'] ? +params['vehicleId'] : null;
      if(this.vehicleId){
        const vehicle = this.store.getVehicleById(this.vehicleId)();
        if(vehicle){
          this.vehicle = vehicle;
        }
      }
    })
  }



}
