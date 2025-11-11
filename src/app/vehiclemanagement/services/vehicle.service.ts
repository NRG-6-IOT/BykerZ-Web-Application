import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private baseUrl = `${environment.platformProviderApiBaseUrl}/vehicles`;
  private modelsUrl = `${environment.platformProviderApiBaseUrl}/models`;

  constructor(private http: HttpClient) {}

  getVehiclesByOwnerId(ownerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/owner/${ownerId}`);
  }

  getAllModels(): Observable<any[]> {
    return this.http.get<any[]>(this.modelsUrl);
  }
}
