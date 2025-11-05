import {Component, Input} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {NgOptimizedImage} from '@angular/common';
import {Vehicle} from '@app/vehiclemanagement/domain/model/vehicle.entity';
import {RouterLink} from '@angular/router';

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

  GetOwnerNameById(id: number): string {
    switch (id) {
      case 10:
        return "Carlos Mendoza";
      case 11:
        return "Lucía Fernández";
      case 12:
        return "Andrés Rivas";
      default:
        return "Desconocido";
    }
    return "Desconocido";
  }

  GetMechanicNameById(id: number): string {
    switch (id) {
      case 20:
        return "Jorge Ramírez";
      case 21:
        return "María López";
      case 22:
        return "Raúl Castillo";
      default:
        return "Desconocido";
    }
    return "Desconocido";
  }

}
