import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Assignment } from '../domain/model/assignment.entity';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private baseUrl = `${environment.serverBaseUrl}/mechanic`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'accept': '*/*'
    });
  }

  /**
   * Get all assignments associated to the specified mechanic filtered by status
   * @param mechanicId - The ID of the mechanic
   * @param status - The status to filter by
   * @returns Observable of Assignment array
   */
  getAssignmentsByMechanicIdAndStatus(mechanicId: number, status: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(
      `${this.baseUrl}/${mechanicId}/assignments/${status}`,
      { headers: this.getHeaders() }
    );
  }
}
