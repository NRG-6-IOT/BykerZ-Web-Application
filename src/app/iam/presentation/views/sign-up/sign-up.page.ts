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

      console.log(`Requesting sign up`);
      this.authenticationService.signUp(signUpRequest).subscribe({
        next: () => {
          const signInRequest: SignInRequest = { username, password };

          // Perform auto sign-in
          this.authenticationService.signIn(signInRequest, false).subscribe({
            next: (response) => {
              // Fetch and store role-specific ID before navigating
              this.authenticationService.getRoleSpecificUserId().subscribe({
                next: (id) => {
                  console.log('Fetched and stored owner/mechanic ID:', id);
                  this.router.navigate(['/verify'], {
                    queryParams: {invitationCode: this.invitationCode},
                  }).then();
                },
                error: (err) => {
                  console.error('Failed to fetch user role ID after sign-in:', err);
                  this.router.navigate(['/sign-in']).then();
                },
              });
            },
            error: (err) => {
              console.error('Auto sign in failed:', err);
            },
          });
        },
        error: (err) => {
          console.error('Sign up failed:', err);
        },
      });
    }
  }
