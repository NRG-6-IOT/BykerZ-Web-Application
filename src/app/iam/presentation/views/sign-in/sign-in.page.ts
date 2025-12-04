import {Component, OnInit} from '@angular/core';
import {BaseFormComponent} from '@app/shared/presentation/components/base-form.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {SignInRequest} from '@app/iam/domain/model/sign-in.request';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {RouterLink} from '@angular/router';
import {NgOptimizedImage, CommonModule} from '@angular/common';
import {LanguageSwitcherComponent} from '@app/shared/presentation/components/language-switcher/language-switcher';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, MatButtonModule, MatFormFieldModule,
    MatInputModule, RouterLink, NgOptimizedImage, LanguageSwitcherComponent,
    TranslateModule, CommonModule
  ],
  templateUrl: './sign-in.page.html',
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 2rem;
    }

    .auth-card {
      display: flex;
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      overflow: hidden;
      width: 100%; max-width: 900px; min-height: 550px;
      animation: fadeIn 0.6s ease-out;
    }

    /* Izquierda */
    .brand-section {
      flex: 1;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 3rem;
      position: relative;
      text-align: center;
    }

    .logo-img { filter: drop-shadow(0 4px 12px rgba(255,255,255,0.1)); margin-bottom: 1.5rem; }
    .brand-name {
      margin: 1rem 0;
      font-size: 3.5rem;
      line-height: 1.1;
      display: block;
      height: auto;
      font-weight: 800;
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-slogan { font-size: 1rem; opacity: 0.7; letter-spacing: 1px; font-weight: 300; }

    .lang-switch-wrapper { position: absolute; bottom: 2rem; }

    /* Derecha */
    .form-section {
      flex: 1; padding: 4rem 3rem;
      display: flex; flex-direction: column; justify-content: center;
    }

    .form-title { font-size: 2rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2rem; text-align: center; }

    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.3px;
      padding-left: 0.25rem;
    }

    /* --- INPUTS GLASS CORREGIDOS (TEXTO NEGRO) --- */
    ::ng-deep .custom-field .mdc-notched-outline { display: none !important; }
    ::ng-deep .custom-field .mat-mdc-form-field-bottom-align::before { display: none !important; }

    ::ng-deep .custom-field .mat-mdc-form-field-flex {
      background-color: #f4f4f4 !important;
      border-radius: 12px !important;
      padding: 0 16px !important;
      border: 1px solid #ccc;
      transition: all 0.2s ease;
      height: 56px;
      align-items: center;
    }

    ::ng-deep .custom-field.mat-focused .mat-mdc-form-field-flex {
      border-color: #ff6b35 !important;
      background-color: #fff !important;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    ::ng-deep .custom-field input {
      color: #000000 !important;
      font-weight: 600;
      -webkit-text-fill-color: #000000 !important;
      caret-color: #ff6b35;
    }

    ::ng-deep .custom-field .mat-mdc-floating-label {
      top: 50% !important;
      transform: translateY(-50%);
      color: #666 !important;
      font-weight: 500;
      pointer-events: none;
      transition: all 0.2s ease;
    }

    ::ng-deep .custom-field.mat-form-field-should-float .mat-mdc-floating-label {
      transform: translateY(-30px) scale(0.85) !important;
      color: #ff6b35 !important;
      background: white !important;
      padding: 0 6px;
      margin-left: -6px;
      z-index: 10;
    }

    /* Botones */
    .actions { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }

    .btn-primary {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; border: none; padding: 1rem; border-radius: 12px;
      font-weight: 700; cursor: pointer; transition: all 0.2s;
      font-size: 1rem; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-secondary {
      background: white; border: 2px solid #f0f0f0; color: #666;
      padding: 0.8rem; border-radius: 12px; font-weight: 600; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: #333; color: #333; }

    .divider { text-align: center; color: #ccc; font-size: 0.85rem; position: relative; }
    .divider::before, .divider::after {
      content: ''; position: absolute; top: 50%; width: 45%; height: 1px; background: #eee;
    }
    .divider::before { left: 0; } .divider::after { right: 0; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .auth-card { flex-direction: column; min-height: auto; max-width: 500px; }
      .brand-section { padding: 2rem; }
      .form-section { padding: 2rem; }
    }
  `]
})
export class SignInPage extends BaseFormComponent implements OnInit {
  signInFormGroup!: FormGroup;
  submitted = false;

  constructor(private builder: FormBuilder, private authenticationService: AuthenticationService) { super(); }

  ngOnInit() {
    this.signInFormGroup = this.builder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  signIn() {
    if (this.signInFormGroup.invalid) return;
    const { username, password } = this.signInFormGroup.value;
    this.authenticationService.signIn(new SignInRequest(username, password)).subscribe({
      next: () => console.log('Sign in successful'),
      error: (err) => console.error('Sign in failed:', err)
    });
    this.submitted = true;
  }
}
