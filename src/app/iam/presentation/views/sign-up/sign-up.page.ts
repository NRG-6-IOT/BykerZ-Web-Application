import {Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BaseFormComponent} from '@app/shared/presentation/components/base-form.component';
import {SignUpRequest} from '@app/iam/domain/model/sign-up.request';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap, tap} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '@app/shared/presentation/components/language-switcher/language-switcher';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatButtonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, TranslateModule, LanguageSwitcherComponent, CommonModule
  ],
  template: `
    <div class="auth-container">
      <div class="signup-card">
        <div class="auth-header">
          <app-language-switcher></app-language-switcher>
        </div>
        <div class="header-section">
          <h1 class="page-title">{{'register.signUp'|translate}}</h1>
          <p class="subtitle">Join BykerZ today</p>
        </div>

        <form [formGroup]="signUpForm" (ngSubmit)="onSubmit()" class="signup-form">

          <div class="row-2">
            <div class="field-group">
              <label class="input-label">{{'register.firstName'|translate}}</label>
              <mat-form-field appearance="outline" class="custom-field">
                <input matInput formControlName="firstName" placeholder="e.g. Juan" required />
              </mat-form-field>
            </div>

            <div class="field-group">
              <label class="input-label">{{'register.lastName'|translate}}</label>
              <mat-form-field appearance="outline" class="custom-field">
                <input matInput formControlName="lastName" placeholder="e.g. Perez" required />
              </mat-form-field>
            </div>
          </div>

          <div class="field-group">
            <label class="input-label">{{'register.username'|translate}}</label>
            <mat-form-field appearance="outline" class="custom-field">
              <input matInput formControlName="username" placeholder="Create a unique username" required />
            </mat-form-field>
          </div>

          <div class="field-group">
            <label class="input-label">{{'register.email'|translate}}</label>
            <mat-form-field appearance="outline" class="custom-field">
              <input matInput formControlName="email" placeholder="example@mail.com" required />
            </mat-form-field>
          </div>

          <div class="field-group">
            <label class="input-label">{{'register.photoUrl'|translate}}</label>
            <mat-form-field appearance="outline" class="custom-field">
              <input matInput formControlName="photoUrl" placeholder="https://image.com/profile.jpg" required />
            </mat-form-field>
          </div>

          <div class="row-2">
            <div class="field-group">
              <label class="input-label">{{'register.password'|translate}}</label>
              <mat-form-field appearance="outline" class="custom-field">
                <input matInput type="password" formControlName="password" placeholder="******" required />
              </mat-form-field>
            </div>

            <div class="field-group">
              <label class="input-label">{{'register.confirmPassword'|translate}}</label>
              <mat-form-field appearance="outline" class="custom-field">
                <input matInput type="password" formControlName="confirmPassword" placeholder="******" required />
              </mat-form-field>
            </div>
          </div>

          <button type="submit" class="btn-primary" [disabled]="signUpForm.invalid">
            {{'register.button'|translate}}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      display: flex; flex-direction: column; align-items: center;
    }

    .auth-header { width: 100%; display: flex; justify-content: flex-end; max-width: 800px; }

    .signup-card {
      background: white; border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      width: 100%; max-width: 800px; padding: 3rem;
      animation: slideUp 0.5s ease-out;
    }

    .header-section { text-align: center; margin-bottom: 2rem; }
    .page-title {
      margin: 0.5rem 0;
      font-size: clamp(2.5rem, 2.5vw, 1.6rem);
      line-height: 1.1;
      display: block;
      height: auto;
      font-weight: 800;
      color: #1a1a1a;
    }
    .subtitle { color: #666; margin-top: 0.5rem; font-size: 1.1rem; }

    .signup-form { display: flex; flex-direction: column; gap: 1.25rem; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }

    /* Grupo de Campo (Label + Input) */
    .field-group {
      display: flex; flex-direction: column; gap: 0.5rem;
    }

    /* Etiqueta Externa (El "Nombre" encima del input) */
    .input-label {
      font-size: 0.9rem;
      font-weight: 700;
      color: #333; /* Gris oscuro para buen contraste */
      margin-left: 4px;
      text-transform: capitalize;
    }

    /* --- ESTILOS DE INPUTS --- */
    ::ng-deep .custom-field .mdc-notched-outline { display: none !important; }
    ::ng-deep .custom-field .mat-mdc-form-field-bottom-align::before { display: none !important; }

    ::ng-deep .custom-field .mat-mdc-form-field-flex {
      background-color: #f4f4f4 !important; /* Gris claro para diferenciar del fondo blanco */
      border-radius: 12px !important;
      padding: 0 16px !important;
      border: 1px solid #ccc; /* Borde sutil */
      height: 50px;
      align-items: center;
      transition: all 0.2s ease;
    }

    ::ng-deep .custom-field.mat-focused .mat-mdc-form-field-flex {
      border-color: #ff6b35 !important;
      background-color: #fff !important;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    /* TEXTO NEGRO FORZADO */
    ::ng-deep .custom-field input {
      color: #000000 !important;
      font-weight: 600;
      caret-color: #ff6b35;
    }

    /* Placeholder Styling */
    ::ng-deep .custom-field input::placeholder {
      color: #999 !important;
      font-weight: 400;
    }

    /* Hide floating label if present */
    ::ng-deep .custom-field .mat-mdc-floating-label { display: none !important; }

    /* -------------------------- */

    .btn-primary {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; border: none; padding: 1rem; border-radius: 12px;
      font-weight: 700; cursor: pointer; margin-top: 1.5rem; font-size: 1.1rem;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3); transition: all 0.2s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4); }
    .btn-primary:disabled { background: #e0e0e0; color: #999; cursor: not-allowed; box-shadow: none; }

    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 640px) {
      .signup-card { padding: 1.5rem; }
      .row-2 { grid-template-columns: 1fr; gap: 1rem; }
    }
  `]
})
export class SignUpPage extends BaseFormComponent implements OnInit {
  signUpForm!: FormGroup;
  invitationCode: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { super(); }

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

    this.authenticationService.signUp(signUpRequest).pipe(
      switchMap(() => this.authenticationService.signIn({ username, password }, false)),
      switchMap(() => this.authenticationService.getRoleSpecificUserId()),
      tap(() => this.router.navigate(['/verify'], { queryParams: {invitationCode: this.invitationCode} }))
    ).subscribe();
  }
}
