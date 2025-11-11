import {Component, OnInit} from '@angular/core';
import {catchError, EMPTY, switchMap, tap} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '@app/iam/services/authentication.service';

@Component({
  selector: 'app-verify-owner',
  imports: [],
  templateUrl: './verify-owner.html'
})
export class VerifyOwner implements OnInit {

  baseUrl: string = `${environment.platformProviderApiBaseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'})};
  invitationCode: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  // TODO: Move these methods to a dedicated store
  // Fetch assignment info
  verifyAssignmentCode(assignmentCode: string) {
    const url = `${this.baseUrl}/assignments/code/${encodeURIComponent(assignmentCode)}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  // Assign owner to that assignment
  assignOwnerToAssignment(assignmentCode: string, ownerId: number) {
    const url = `${this.baseUrl}/assignments/code/${encodeURIComponent(assignmentCode)}/assign-owner/${ownerId}`;
    return this.http.patch<any>(url, null, this.httpOptions);
  }

  ngOnInit() {
    this.invitationCode = this.route.snapshot.queryParamMap.get('invitationCode');
    const ownerId = Number(localStorage.getItem('role_id') ?? 0);

    if (!this.invitationCode || ownerId === 0) {
      console.warn('❌ Missing invitation code or invalid owner ID');
      this.handleInvalidState();
      return;
    }

    this.verifyAssignmentCode(this.invitationCode).pipe(
      tap(() => console.log(`Invitation code verified: ${this.invitationCode}`)),

      switchMap(() => {
        console.log(`Assigning owner ${ownerId} to assignment ${this.invitationCode}`);
        return this.assignOwnerToAssignment(this.invitationCode!, ownerId);
      }),

      tap(() => console.log('Owner assigned successfully')),

      tap(() => {
        this.router.navigate(['/owner-dashboard']).then();
      }),

      catchError(err => {
        console.error('Verification or assignment failed:', err);
        this.handleInvalidState();
        return EMPTY;
      })
    ).subscribe();
  }

  private handleInvalidState() {
    this.authenticationService.signOut();
    setTimeout(() => {
      this.router.navigate(['/sign-in']).then();
    }, 3000);
  }
}
