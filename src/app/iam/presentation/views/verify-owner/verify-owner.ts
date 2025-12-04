import {Component, OnInit} from '@angular/core';
import {catchError, EMPTY, switchMap, tap} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-verify-owner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-owner.html',
  styles: [`
    .verify-page {
      height: 100vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      background: #f8f9fa; font-family: 'Segoe UI', sans-serif;
    }
    .spinner {
      width: 50px; height: 50px; border: 4px solid #eee; border-top-color: #ff6b35;
      border-radius: 50%; animation: spin 1s infinite linear; margin-bottom: 1.5rem;
    }
    h2 { color: #1a1a1a; margin: 0 0 0.5rem; }
    p { color: #666; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
  `]
})
export class VerifyOwner implements OnInit {
  // ... (La lógica se mantiene igual que en tu archivo original) ...
  baseUrl: string = `${environment.platformProviderApiBaseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'})};
  invitationCode: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  verifyAssignmentCode(assignmentCode: string) {
    const url = `${this.baseUrl}/assignments/code/${encodeURIComponent(assignmentCode)}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  assignOwnerToAssignment(assignmentCode: string, ownerId: number) {
    const url = `${this.baseUrl}/assignments/code/${encodeURIComponent(assignmentCode)}/assign-owner/${ownerId}`;
    return this.http.patch<any>(url, null, this.httpOptions);
  }

  ngOnInit() {
    this.invitationCode = this.route.snapshot.queryParamMap.get('invitationCode');
    const ownerId = Number(localStorage.getItem('role_id') ?? 0);

    if (!this.invitationCode || ownerId === 0) {
      this.handleInvalidState();
      return;
    }

    this.verifyAssignmentCode(this.invitationCode).pipe(
      switchMap(() => this.assignOwnerToAssignment(this.invitationCode!, ownerId)),
      tap(() => this.router.navigate(['/owner-dashboard'])),
      catchError(() => {
        this.handleInvalidState();
        return EMPTY;
      })
    ).subscribe();
  }

  private handleInvalidState() {
    this.authenticationService.signOut();
    setTimeout(() => this.router.navigate(['/sign-in']), 3000);
  }
}
