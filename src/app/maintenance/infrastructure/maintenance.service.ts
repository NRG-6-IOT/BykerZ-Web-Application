import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Maintenance } from '../domain/model/maintenance.entity';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private baseUrl = `${environment.serverBaseUrl}/maintenance`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });
  }


  getMaintenanceById(maintenanceId: number): Observable<Maintenance> {
    return this.http.get<Maintenance>(`${this.baseUrl}/${maintenanceId}`, { headers: this.getHeaders() });
  }

  getMaintenancesByMechanicId(mechanicId: number): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.baseUrl}/mechanic/${mechanicId}`, { headers: this.getHeaders() });
  }

  getMaintenancesByVehicleId(vehicleId: number): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(`${this.baseUrl}/vehicle/${vehicleId}`, { headers: this.getHeaders() });
  }

  createMaintenance(maintenance: Omit<Maintenance, 'id' | 'state' | 'expense'>): Observable<Maintenance> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.post<Maintenance>(this.baseUrl, maintenance, { headers });
  }

  deleteMaintenance(maintenanceId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${maintenanceId}`, { headers: this.getHeaders() });
  }

  updateMaintenanceStatus(maintenanceId: number, newStatus: string): Observable<Maintenance> {
    const headers = this.getHeaders().set('Content-Type', 'application/json');
    return this.http.put<Maintenance>(`${this.baseUrl}/${maintenanceId}`, { newStatus }, { headers });
  }

  assignExpenseToMaintenance(maintenanceId: number, expenseId: number): Observable<Maintenance> {
    const headers = this.getHeaders();
    return this.http.put<Maintenance>(`${this.baseUrl}/${maintenanceId}/expense/assign/${expenseId}`, null, { headers });
  }


}
