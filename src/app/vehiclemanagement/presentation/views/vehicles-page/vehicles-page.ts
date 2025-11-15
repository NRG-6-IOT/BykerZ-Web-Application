import {Component, inject, OnInit} from '@angular/core';
import {Model, Vehicle} from '../../../domain/model/vehicle.entity';
import {VehicleCard} from '@app/vehiclemanagement/presentation/components/vehicle-card/vehicle-card';
import {MatFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {RegisterVehicleDialog} from '@app/vehiclemanagement/presentation/components/register-vehicle-dialog/register-vehicle-dialog';
import {VehiclesStore} from "@app/vehiclemanagement/application/vehicles.store";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-vehicles-page',
  imports: [
    VehicleCard,
    MatIconModule,
    MatFabButton
  ],
  templateUrl: './vehicles-page.html',
  standalone: true,
  styleUrl: './vehicles-page.css'
})
export class VehiclesPage implements OnInit {

  readonly store = inject(VehiclesStore);
  readonly dialog = inject(MatDialog);

  ngOnInit() {
    const roleId = localStorage.getItem('role_id');
    if (roleId) {
      this.store.loadVehiclesByOwner(+roleId)
    }
  }

  get vehicles() {
    return this.store.vehicles();
  }

  OpenCreateDialog() {
    let dialogRef = this.dialog.open(RegisterVehicleDialog, {
      hasBackdrop: true,
      maxWidth: '90vw'
    })
  }

}
