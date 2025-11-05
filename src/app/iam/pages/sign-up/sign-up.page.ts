import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BaseFormComponent} from '@app/shared/components/base-form.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {SignUpRequest} from '@app/iam/model/sign-up.request';
import {AuthenticationService} from '@app/iam/services/authentication.service';

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

  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    this.signUpForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      photoUrl: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
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
    let roles = [this.signUpForm.value.role];

    const signUpRequest = new SignUpRequest(firstName, lastName, username, email, photoUrl, password, roles);
    console.log(`Requesting sign up`);
    this.authenticationService.signUp(signUpRequest);
    this.submitted = true;
  }
}
