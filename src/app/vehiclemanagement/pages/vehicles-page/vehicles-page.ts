import {Component, OnInit} from '@angular/core';
import {Model, Vehicle} from '../../model/vehicle.entity';
import {VehicleCard} from '../../components/vehicle-card/vehicle-card';
import {MatFabButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {RegisterVehicleDialog} from '../../components/register-vehicle-dialog/register-vehicle-dialog';

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

  vehicles: Vehicle[] = [];

  constructor(
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.fetchVehicles()
  }

  fetchVehicles(): void {
    this.vehicles = [
      new Vehicle({
        id: 1,
        ownerId: 10,
        mechanicId: 20,
        model: new Model({
          id: 1,
          name: "CB190R",
          brand: "Honda",
          modelYear: "2024",
          originCountry: "Japón",
          producedAt: "China",
          type: "Naked",
          displacement: "184.4cc",
          potency: "16.4 CV @ 8000 RPM",
          engineType: "4T monocilíndrico, SOHC, refrigerado por aire",
          engineTorque: "16.3 Nm @ 7000 RPM",
          weight: "136 kg (seco)",
          transmission: "5 velocidades",
          brakes: "Disco 276mm (sin ABS)",
          tank: "12 litros",
          seatHeight: "771 mm",
          consumption: "40-45 km/L",
          price: "S/. 10 500 - 11 500",
          oilCapacity: "1.0 L",
          connectivity: "Sin conectividad",
          durability: "Buena",
          octane: "95cc"
        }),
        year: "2025",
        plate: "3564-YT",
      }),

      new Vehicle({
        id: 2,
        ownerId: 11,
        mechanicId: 21,
        model: new Model({
          id: 2,
          name: "FZS 25",
          brand: "Yamaha",
          modelYear: "2023",
          originCountry: "Japón",
          producedAt: "India",
          type: "Sport",
          displacement: "249 cc",
          potency: "20.8 CV @ 7250 RPM",
          engineType: "4T monocilíndrico, SOHC, refrigerado por aire",
          engineTorque: "20 Nm @ 6000 RPM",
          weight: "153 kg (seco)",
          transmission: "5 velocidades",
          brakes: "Disco delantero 282mm / Trasero 220mm (sin ABS)",
          tank: "14 litros",
          seatHeight: "795 mm",
          consumption: "30-35 km/L",
          price: "S/. 17 000 - 18 500",
          oilCapacity: "1.2 L",
          connectivity: "No",
          durability: "Alta",
          octane: "90–95cc"
        }),
        year: "2024",
        plate: "1324-AF",
      }),

      new Vehicle({
        id: 3,
        ownerId: 12,
        mechanicId: 22,
        model: new Model({
          id: 3,
          name: "NT 200",
          brand: "KTM",
          modelYear: "2022",
          originCountry: "Austria",
          producedAt: "Austria",
          type: "Naked",
          displacement: "199.5 cc",
          potency: "25 CV @ 10000 RPM",
          engineType: "4T monocilíndrico, DOHC, refrigerado por líquido",
          engineTorque: "19.2 Nm @ 8000 RPM",
          weight: "172 kg (listo para rodar)",
          transmission: "6 velocidades",
          brakes: "Disco delantero 300mm / Trasero 230mm (ABS)",
          tank: "13 litros",
          seatHeight: "820 mm",
          consumption: "25-30 km/L",
          price: "S/. 25 000 - 27 000",
          oilCapacity: "2.6 L",
          connectivity: "Bluetooth + App",
          durability: "Muy alta",
          octane: "95–98cc"
        }),
        year: "2022",
        plate: "9548-JI",
      }),
    ];
  }

  OpenCreateDialog() {
    let dialogRef = this.dialog.open(RegisterVehicleDialog, {
      hasBackdrop: true,
      maxWidth: '90vw'
    })
  }

}
