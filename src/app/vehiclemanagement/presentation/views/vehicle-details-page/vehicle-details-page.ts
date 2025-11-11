import {Component, inject, OnInit} from '@angular/core';
import {Model, Vehicle} from '../../../domain/model/vehicle.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {VehiclesStore} from "@app/vehiclemanagement/application/vehicles.store";
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-vehicle-details-page',
  imports: [
    NgOptimizedImage,
    MatCard,
    MatButton
  ],
  templateUrl: './vehicle-details-page.html',
  standalone: true,
  styleUrl: './vehicle-details-page.css'
})
export class VehicleDetailsPage {
  private route = inject(ActivatedRoute);
  private store = inject(VehiclesStore);

  private router = inject(Router);

  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;

  constructor() {
    this.route.params.subscribe(params => {
      this.vehicleId = params['vehicleId'] ? +params['vehicleId'] : null;
      if (this.vehicleId) {
        const vehicle = this.store.getVehicleById(this.vehicleId)();
        if (vehicle) {
          this.vehicle = vehicle;
        }
      }
    })
  }

  navigateToMetrics() {
    // Opción 1: Si tienes el ID del vehículo
    if (this.vehicle?.id) {
      this.router.navigate(['/wellness-metrics'], {
        queryParams: {vehicleId: this.vehicle.id}
      });
    }


  }
}
