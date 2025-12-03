import {environment} from '@env/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, map, Observable, tap, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {SignUpRequest} from '@app/iam/domain/model/sign-up.request';
import {SignUpResponse} from '@app/iam/domain/model/sign-up.response';
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';
import {SignInResponse} from '@app/iam/domain/model/sign-in-response';
import {inject, Injectable} from '@angular/core';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseUrl: string = `${environment.platformProviderApiBaseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'})};

  private signedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private signedInUserId: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private userIdSubject = new BehaviorSubject<number | null>(null);

  public currentUserId = this.userIdSubject.asObservable();

  private expenseStore = inject(ExpenseStore);
  private maintenanceStore = inject(MaintenanceStore);

  constructor(private router: Router, private http: HttpClient) {
    // Inicializar userId desde localStorage si existe
    this.initializeUserId();
  }

  private initializeUserId(): void {
    const roleId = localStorage.getItem('role_id');
    if (roleId) {
      const id = Number(roleId);
      if (!isNaN(id) && id > 0) {
        this.userIdSubject.next(id);
      }
    }
  }

  /**
   * Get current user ID synchronously
   */
  getCurrentUserIdSync(): number | null {
    return this.userIdSubject.value;
  }

  /**
   * Get user ID from token
   */
  getUserIdFromToken(): number | null {
    try {
      const token = localStorage.getItem('token')?.replace(/^"|"$/g, '');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id || payload.userId || payload.sub;
        return userId ? Number(userId) : null;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    return null;
  }

  tryAutoSignIn(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    this.signedIn.next(true);
    this.initializeUserId();
    return;
  }

  get isSignedIn() {
    return this.signedIn.asObservable();
  }

  currentUserRole(): string {
    return localStorage.getItem('user_role') || '';
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
        this.userIdSubject.next(id);
      })
    );
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
   * @param redirectToDashboard
   * @return The sign in response.
   */
  signIn(signInRequest: SignInRequest, redirectToDashboard = true): Observable<SignInResponse> {
    return this.http.post<SignInResponse>(`${this.baseUrl}/authentication/sign-in`, signInRequest, this.httpOptions)
      .pipe(
        tap(response => {
          console.log('Attempting sign-in with response:', response);
          this.signedIn.next(true);
          this.signedInUserId.next(response.id);
          localStorage.setItem('token', response.token);

          if (response.roles.includes('ROLE_MECHANIC')) {
            console.log('Signing in as mechanic');
            localStorage.setItem('user_role', 'ROLE_MECHANIC');
            if (redirectToDashboard) {
              this.getRoleSpecificUserId().subscribe({
                next: () => {
                  this.router.navigate(['/mechanic-dashboard']).then();
                },
                error: (err) => {
                  console.error('Failed to fetch mechanic profile id', err);
                  this.signOut()
                }
              });
            }

          } else if (response.roles.includes('ROLE_OWNER')) {
            console.log('Signing in as owner');
            localStorage.setItem('user_role', 'ROLE_OWNER');
            if (redirectToDashboard) {
              this.getRoleSpecificUserId().subscribe({
                next: () => {
                  this.router.navigate(['/owner-dashboard']).then();
                },
                error: (err) => {
                  console.error('Failed to fetch owner profile id', err);
                  this.signOut();
                }
              });
            }
          }
        })
      );
  }

  /**
   * Sign out the current user.
   */
  signOut() {
    this.signedIn.next(false);
    this.signedInUserId.next(0);
    this.userIdSubject.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role_id');
    localStorage.removeItem('user_role');
    localStorage.removeItem('compare_page_state');

    // Reset all stores to clear cached data
    this.expenseStore.reset();
    this.maintenanceStore.reset();

    this.router.navigate(['/sign-in']).then();
  }
}
