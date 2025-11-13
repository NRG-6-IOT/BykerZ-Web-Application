import {Component, inject, OnInit} from '@angular/core';
import {Model, Vehicle} from '../../../domain/model/vehicle.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {VehiclesStore} from "@app/vehiclemanagement/application/vehicles.store";
import {MatButton} from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

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
export class VehicleDetailsPage implements OnInit {
  vehicleId: number | null = null;
  vehicle: Vehicle | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: VehiclesStore,
    private http: HttpClient
  ) {}

  ngOnInit() {
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
    if (this.vehicle?.id) {
      this.router.navigate(['/wellness-metrics'], {
        queryParams: {vehicleId: this.vehicle.id}
      });
    }
  }

  exportReport() {
    if (!this.vehicle?.id) return;

    const url = `${environment.platformProviderApiBaseUrl}/reports/vehicle/${this.vehicle.id}/export`;
    const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
    console.log('🔑 Token enviado:', token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get(url, { responseType: 'text', headers }).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `vehicle-report-${this.vehicle?.id}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      },
      error: (err) => {
        console.error('Error exporting report', err);
        alert('Error al exportar el reporte.');
      }
    });
  }
}
