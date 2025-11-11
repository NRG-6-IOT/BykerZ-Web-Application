import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '@env/environment';
import {Expense} from '@app/maintenance/domain/model/expense.entity';


@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private baseUrl = `${environment.serverBaseUrl}/expense`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'accept': '*/*'
    });
  }

  createExpense(userId: number, expense: Omit<Expense, 'id'>): Observable<Expense> {
    const headers = this.getHeaders();
    return this.http.post<Expense>(`${this.baseUrl}/${userId}`, expense, { headers });
  }

  getAllExpenses(): Observable<Expense[]> {
    const headers = this.getHeaders();
    return this.http.get<Expense[]>(this.baseUrl, { headers });
  }

  getExpenseById(expenseId: number): Observable<Expense> {
    const headers = this.getHeaders();
    return this.http.get<Expense>(`${this.baseUrl}/${expenseId}`, { headers });
  }

  deleteExpense(expenseId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}/${expenseId}`, { headers });
  }
}


