import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private http = inject(HttpClient);
  private readonly PING_INTERVAL = 30000; // 30 seconds

  startHealthCheck(): void {
    // Ping the current origin every 30 seconds
    interval(this.PING_INTERVAL).subscribe(() => {
      this.ping();
    });
  }

  private ping(): void {
    // Make a simple request to the /health endpoint to keep the service alive
    const url = window.location.origin + '/health';

    this.http.get(url, {
      responseType: 'text',
      headers: { 'Cache-Control': 'no-cache' }
    }).pipe(
      catchError(error => {
        console.log('Health check ping (error ignored):', error);
        return of(null);
      })
    ).subscribe(() => {
      console.log('Health check ping sent at:', new Date().toISOString());
    });
  }
}

