import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {SignUpRequest} from '@app/iam/domain/model/sign-up.request';
import {SignUpResponse} from '@app/iam/domain/model/sign-up.response';
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';
import {SignInResponse} from '@app/iam/domain/model/sign-in-response';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string = `${environment.platformProviderApiBaseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'})};

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(private router: Router, private http: HttpClient) { }

  tryAutoSignIn(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.signedIn.next(true);
    return;
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  get currentUserId() {
    return this.signedInUserId.asObservable();
  }

  getRoleSpecificUserId(): Observable<number> {
    const role = localStorage.getItem('user_role') || '';
    const endpoint =
      role === 'ROLE_OWNER' ? `${this.baseUrl}/users/owner`
        : role === 'ROLE_MECHANIC' ? `${this.baseUrl}/users/mechanic`
          : null;

    if (!endpoint) {
      return throwError(() => new Error('No user role found for profile lookup'));
    }

    console.log(`Using the endpoint ${endpoint}`);
    return this.http.get<any>(endpoint, this.httpOptions).pipe(
      map(res => {
        if (role === 'ROLE_OWNER') return res.ownerId;
        if (role === 'ROLE_MECHANIC') return res.mechanicId;
        throw new Error('Unknown role');
      }),
      tap(id => {
        localStorage.setItem('role_id', String(id));
      })
    );
  }

  // TODO: Endpoints should be moved to the API
  verifyAssignmentCode(assignmentCode: string): Observable<any> {
    const url = `${this.baseUrl}/assignments/code/${encodeURIComponent(assignmentCode)}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  assignOwnerToAssignment(assignmentCode: string, ownerId: number): Observable<any> {
    const url = `${this.baseUrl}/assignments/code/${encodeURIComponent(assignmentCode)}/assign-owner/${ownerId}`;
    return this.http.patch<any>(url, null, this.httpOptions);
  }

  /**
   * Sign up a new user.
   * @param signUpRequest
   * @return The sign up response.
   */
  signUp(signUpRequest: SignUpRequest) : Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.baseUrl}/authentication/sign-up`, signUpRequest, this.httpOptions);
  }

  /**
   * Sign in an existing user.
   * @param signInRequest
   * @return The sign in response.
   */
  signIn(signInRequest: SignInRequest) {
    return this.http.post<SignInResponse>(`${this.baseUrl}/authentication/sign-in`, signInRequest, this.httpOptions)
      .subscribe({
        next: (response) => {
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          localStorage.setItem('token', response.token);

          if (response.roles.includes('ROLE_MECHANIC')) {
            localStorage.setItem('user_role', 'ROLE_MECHANIC');

            this.getRoleSpecificUserId().subscribe({
              next: (id) => {
                this.router.navigate(['/mechanic-dashboard']);
              },
              error: (err) => {
                console.error('Failed to fetch mechanic profile id', err);
              }
            });

          } else if (response.roles.includes('ROLE_OWNER')) {
            localStorage.setItem('user_role', 'ROLE_OWNER');
            this.getRoleSpecificUserId().subscribe({
              next: (id) => {
                console.log('Stored role_id:', id);
                this.router.navigate(['/owner-dashboard']);
              },
              error: (err) => {
                console.error('Failed to fetch mechanic profile id', err);
              }
            });
          }
        },
        error: (error) => {
          this.signedIn.next(false);
          this.signedInUserId.next(0);
          console.error(`Error while signing in: ${error}`);
          this.router.navigate(['/sign-in']).then();
        }
      });
  }

  /**
   * Sign out the current user.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    localStorage.removeItem('token');
    localStorage.removeItem('role_id');
    localStorage.removeItem('user_role');
    this.router.navigate(['/sign-in']).then();
  }
}
