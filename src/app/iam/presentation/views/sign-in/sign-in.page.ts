import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '@app/shared/presentation/components/base-form.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    NgOptimizedImage
  ],
  templateUrl: './sign-in.page.html'
})
export class SignInPage extends BaseFormComponent implements OnInit {
  signInFormGroup!: FormGroup;
  submitted = false;

  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    this.signInFormGroup = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signIn() {
    if (this.signInFormGroup.invalid) return;
    let username = this.signInFormGroup.value.username;
    let password = this.signInFormGroup.value.password;
    const signInRequest = new SignInRequest(username, password);
    console.log('Trying to sign-in with request:', signInRequest);
    this.authenticationService.signIn(signInRequest).subscribe({
      next: () => {
        console.log('Sign in successful');
      },
      error: (err) => {
        console.error('Sign in failed:', err);
      }
    });
    this.submitted = true;
  }
}
