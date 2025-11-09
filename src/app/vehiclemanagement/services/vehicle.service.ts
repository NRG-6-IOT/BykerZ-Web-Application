import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vehicle } from '../model/vehicle.entity';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseUrl = `${environment.serverBaseUrl}/vehicles`;

  constructor(private http: HttpClient) { }

  getVehicleById(vehicleId: number): Observable<Vehicle> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });

    return this.http.get<Vehicle>(`${this.baseUrl}/${vehicleId}`, { headers });
  }
}

