import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BaseFormComponent} from '@app/shared/presentation/components/base-form.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SignUpRequest} from '@app/iam/domain/model/sign-up.request';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, Observable, tap, throwError} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-sign-up.component',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './sign-up.page.html'
})
export class SignUpPage extends BaseFormComponent implements OnInit {
  signUpForm!: FormGroup;
  submitted = false;
  invitationCode: string | null = null;
  baseUrl: string = `${environment.platformProviderApiBaseUrl}`;
  httpOptions = { headers: new HttpHeaders({'Content-type': 'application/json'})};

  constructor(
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    private http: HttpClient
  ) {
    super();
  }

  ngOnInit() {
    this.invitationCode = this.route.snapshot.queryParamMap.get('invitationCode')

    this.signUpForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      photoUrl: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  // TODO: Move to service
  getOwnerIdOnCreation(): Observable<number> {
    const endpoint = `${this.baseUrl}/users/owner`;

    return this.http.get<any>(endpoint, this.httpOptions).pipe(
      map(res => {
        return res.ownerId;
      })
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : {mismatch: true};
  }

  onSubmit() {
    if (this.signUpForm.invalid) return;

    let firstName = this.signUpForm.value.firstName;
    let lastName = this.signUpForm.value.lastName;
    let username = this.signUpForm.value.username;
    let email = this.signUpForm.value.email;
    let photoUrl = this.signUpForm.value.photoUrl;
    let password = this.signUpForm.value.password;
    let roles = this.invitationCode === null ? ['ROLE_MECHANIC'] : ['ROLE_OWNER'];

    const signUpRequest = new SignUpRequest(firstName, lastName, username, email, photoUrl, password, roles);

    console.log(`Requesting sign up`);
    this.authenticationService.signUp(signUpRequest).subscribe({
      next: (response) => {
        // assuming response contains the created user id as 'id'
        const ownerId = this.getOwnerIdOnCreation();
        if (this.invitationCode && ownerId) {
          // verify code exists first
          this.authenticationService.verifyAssignmentCode(this.invitationCode).subscribe({
            next: () => {
              // code exists -> assign owner
              this.authenticationService.assignOwnerToAssignment(this.invitationCode!, ownerId).subscribe({
                next: () => {
                  console.log('Owner assigned to assignment code successfully');
                  this.submitted = true;
                  this.router.navigate(['/sign-in']).then();
                },
                error: (err) => {
                  console.error('Failed to assign owner to assignment:', err);
                }
              });
            },
            error: (err) => {
              // code not found or other error: still complete signup but do not assign
              console.warn('Invitation code verification failed or not found:', err);
            }
          });
        } else {
          // no invitation code - just complete signup
          this.submitted = true;
          this.router.navigate(['/sign-in']).then();
        }
      },
      error: (err) => {
        console.error('Sign up failed:', err);
      }
    });
  }
}
