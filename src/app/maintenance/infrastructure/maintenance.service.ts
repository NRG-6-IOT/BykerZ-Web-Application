import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Maintenance } from '../domain/model/maintenance.entity';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private baseUrl = `${environment.serverBaseUrl}/maintenances`;

  constructor(private http: HttpClient) { }

  getMaintenances(): Observable<Maintenance[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });

    return this.http.get<Maintenance[]>(this.baseUrl, { headers });
  }

  getMaintenanceById(maintenanceId: number): Observable<Maintenance> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });

    return this.http.get<Maintenance>(`${this.baseUrl}/${maintenanceId}`, { headers });
  }
}

