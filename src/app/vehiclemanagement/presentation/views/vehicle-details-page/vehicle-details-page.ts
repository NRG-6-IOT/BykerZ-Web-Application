import {Component, inject, OnInit} from '@angular/core';
import {Model, Vehicle} from '../../../domain/model/vehicle.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {VehiclesStore} from "@app/vehiclemanagement/application/vehicles.store";
import {MatButton} from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthenticationService } from '@app/iam/services/authentication.service';

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
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: VehiclesStore,
    private http: HttpClient,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.vehicleId = params['vehicleId'] ? +params['vehicleId'] : null;
      if (this.vehicleId) {
        this.loadVehicle();
      } else {
        this.loading = false;
      }
    })
  }

  private loadVehicle() {
    if (!this.vehicleId) return;

    const vehicle = this.store.getVehicleById(this.vehicleId)();
    if (vehicle) {
      this.vehicle = vehicle;
      this.loading = false;
    } else {
      this.http.get(`${environment.platformProviderApiBaseUrl}/vehicles/${this.vehicleId}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')?.replace(/^"|"$/g, '')}`
        })
      }).subscribe({
        next: (data: any) => {
          this.vehicle = new Vehicle(data);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  navigateToMetrics() {
    if (this.vehicle?.id) {
      this.router.navigate(['/wellness-metrics'], {
        queryParams: {vehicleId: this.vehicle.id}
      });
    }
  }

  navigateToCompare() {
    if (!this.vehicle) return;

    const isMechanic = this.isMechanic();

    if (isMechanic) {
      const modelId = this.vehicle?.model?.id;

      if (modelId) {
        this.router.navigate(['/compare-mechanic'], { queryParams: { vehicleId: modelId } });
      } else {
        this.router.navigate(['/compare-mechanic']);
      }
    } else {
      const vehicleId = this.vehicle?.id;

      if (vehicleId) {
        this.router.navigate(['/compare'], { queryParams: { vehicleId } });
      } else {
        this.router.navigate(['/compare']);
      }
    }
  }

  protected isMechanic(): boolean {

    const userRole = this.authService.currentUserRole();
    if (userRole === 'ROLE_MECHANIC') {
      return true;
    }

    const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.authorities?.[0] || '';
        if (role === 'ROLE_MECHANIC') {
          return true;
        }
      } catch (error) {
      }
    }

    return false;
  }

  exportReport() {
    if (!this.vehicle?.id) return;

    const url = `${environment.platformProviderApiBaseUrl}/reports/vehicle/${this.vehicle.id}/export`;
    const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');

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
        alert('Error al exportar el reporte.');
      }
    });
  }
}
