import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle, Model } from '../../model/model';
import { VehicleCardComponent } from '../../components/vehicle-card/vehicle-card.component';
import { SpecsCardComponent } from '../../components/specs-card/specs-card.component';
import { ScenariosCardComponent } from '../../components/scenarios-card/scenarios-card.component';

@Component({
  standalone: true,
  imports: [CommonModule, VehicleCardComponent, SpecsCardComponent, ScenariosCardComponent],
  selector: 'app-compare-mechanic',
  template: `
    <div class="page">
      <h1 class="page-title">Comparativa (Mecánico)</h1>

      <div class="top-row">
        <app-vehicle-card
          [vehicle]="leftVehicle"
          title="Moto A"
          [selectable]="true"
          [options]="availableVehicles"
          (selectionChange)="onLeftSelect($event)"
          [orange]="true">
        </app-vehicle-card>

        <app-vehicle-card
          [vehicle]="rightVehicle"
          title="Moto B"
          [selectable]="true"
          [options]="availableVehicles"
          (selectionChange)="onRightSelect($event)"
          [orange]="true">
        </app-vehicle-card>
      </div>

      <div class="section">
        <app-specs-card [owner]="leftVehicle" [compare]="rightVehicle"></app-specs-card>
      </div>

      <div class="section">
        <app-scenarios-card [owner]="leftVehicle" [compare]="rightVehicle"></app-scenarios-card>
      </div>
    </div>
  `,
  styles: [`
    .page { max-width:1100px; margin:0 auto; padding:24px; background:#fff; color:#000; font-family: Arial, Helvetica, sans-serif; }
    .page-title { text-align:center; margin-bottom:16px; font-size:20px; }
    .top-row { display:flex; gap:16px; margin-bottom:18px; }
    app-vehicle-card { flex:1; }
    .section { margin-top:12px; }
    @media (max-width:800px) { .top-row { flex-direction:column; } }
  `]
})
export class CompareMechanicComponent implements OnInit {
  leftVehicle: Vehicle | null = null;
  rightVehicle: Vehicle | null = null;
  availableVehicles: Vehicle[] = [];

  ngOnInit(): void {
    this.availableVehicles = [ this.GetVehicleById(1), this.GetVehicleById(2), this.GetVehicleById(3) ];
    this.leftVehicle = this.availableVehicles[0];
    this.rightVehicle = this.availableVehicles[1];
  }

  onLeftSelect(id: number) {
    this.leftVehicle = this.GetVehicleById(id);
  }
  onRightSelect(id: number) {
    this.rightVehicle = this.GetVehicleById(id);
  }

  GetVehicleById(id: number): Vehicle {
    switch (id) {
      case 1:
        return new Vehicle({
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
            potency: "16.4 HP @ 8000 RPM",
            engineType: "4T monocilíndrico, SOHC, refrigerado por aire",
            engineTorque: "16.3 Nm @ 7000 RPM",
            weight: "136kg (dry)",
            transmission: "5 speeds",
            brakes: "276mm disc (without ABS)",
            tank: "12 liters",
            seatHeight: "771mm",
            consumption: "40-45km/L",
            price: "S/. 10,500 - 11,500",
            oilCapacity: "1.0 L",
            connectivity: "Sin conectividad",
            durability: "Buena",
            octane: "95cc"
          }),
          year: "2025",
          plate: "3564-YT",
        });
      case 2:
        return new Vehicle({
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
            potency: "20.8 HP @ 7250 RPM",
            engineType: "4T monocilíndrico, SOHC, refrigerado por aire",
            engineTorque: "20 Nm @ 6000 RPM",
            weight: "153kg (dry)",
            transmission: "5 speeds",
            brakes: "282mm front / 220mm rear (without ABS)",
            tank: "14 liters",
            seatHeight: "795mm",
            consumption: "30-35km/L",
            price: "S/. 17,000 - 18,500",
            oilCapacity: "1.2 L",
            connectivity: "No",
            durability: "Alta",
            octane: "90–95cc"
          }),
          year: "2024",
          plate: "1324-AF",
        });
      case 3:
        return new Vehicle({
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
            potency: "25 HP @ 10000 RPM",
            engineType: "4T monocilíndrico, DOHC, refrigerado por líquido",
            engineTorque: "19.2 Nm @ 8000 RPM",
            weight: "172kg (ready to ride)",
            transmission: "6 speeds",
            brakes: "300mm front / 230mm rear (ABS)",
            tank: "13 liters",
            seatHeight: "820mm",
            consumption: "25-30km/L",
            price: "S/. 25,000 - 27,000",
            oilCapacity: "2.6 L",
            connectivity: "Bluetooth + App",
            durability: "Muy alta",
            octane: "95–98cc"
          }),
          year: "2022",
          plate: "9548-JI",
        });
      default:
        return this.GetVehicleById(1);
    }
  }
}

