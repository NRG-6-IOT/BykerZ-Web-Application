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
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';
import {catchError, of, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-sign-up.component',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './sign-up.page.html'
})
export class SignUpPage extends BaseFormComponent implements OnInit {
  signUpForm!: FormGroup;
  invitationCode: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.invitationCode = this.route.snapshot.queryParamMap.get('invitationCode');

    this.signUpForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photoUrl: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? null : {mismatch: true};
  }

  onSubmit() {
    if (this.signUpForm.invalid) return;

    const { firstName, lastName, username, email, photoUrl, password } = this.signUpForm.value;
    const roles = this.invitationCode === null ? ['ROLE_MECHANIC'] : ['ROLE_OWNER'];
    const signUpRequest = new SignUpRequest(firstName, lastName, username, email, photoUrl, password, roles);
    const signInRequest: SignInRequest = { username, password };

    this.authenticationService.signUp(signUpRequest).pipe(
      tap(() => console.log('Account created successfully')),
      switchMap(() => this.authenticationService.signIn(signInRequest, false)),
      tap(() => console.log('Auto sign-in successful')),
      switchMap(() => this.authenticationService.getRoleSpecificUserId()),
      tap(id => console.log('Stored role-specific user ID:', id)),
      tap(() => {
        this.router.navigate(['/verify'], {
          queryParams: {invitationCode: this.invitationCode}
        }).then();
      }),
      catchError(err => {
        console.error('Error in sign-up:', err);
        return of(null); // Continue gracefully
      })
    ).subscribe();
  }
}
