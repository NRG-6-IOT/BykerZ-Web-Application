import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '@app/iam/model/user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = `${environment.serverBaseUrl}`;

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.baseUrl}/users/${userId}`, { headers });
  }

  getOwnerId(): Observable<{ ownerId: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ ownerId: number }>(`${this.baseUrl}/users/owner`, { headers });
  }

  getMechanicId(): Observable<{ mechanicId: number }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ mechanicId: number }>(`${this.baseUrl}/users/mechanic`, { headers });
  }
}

