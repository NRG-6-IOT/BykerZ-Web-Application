import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '@app/shared/presentation/components/language-switcher/language-switcher';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [FormsModule, TranslateModule, LanguageSwitcherComponent, CommonModule],
  templateUrl: './role-selection.page.html',
  styles: [`
    .selection-page {
      min-height: 100vh; background: #f8f9fa; padding: 2rem;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .header-actions { position: absolute; top: 1.5rem; right: 2rem; }
    .main-title { font-size: 2.5rem; font-weight: 800; color: #1a1a1a; margin-bottom: 3rem; }

    .cards-container {
      display: flex; gap: 2rem; align-items: stretch;
      flex-wrap: wrap; justify-content: center;
    }

    .role-card {
      background: white; padding: 2.5rem; border-radius: 24px;
      width: 320px; text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.05);
      border: 2px solid transparent; transition: all 0.3s ease;
      display: flex; flex-direction: column; align-items: center;
    }

    .role-card:hover { transform: translateY(-8px); border-color: #ff6b35; box-shadow: 0 15px 40px rgba(255, 107, 53, 0.15); }

    .card-icon { font-size: 3.5rem; margin-bottom: 1.5rem; background: #fff5f0; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .role-title { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin: 0 0 0.5rem; }
    .role-desc { color: #666; margin-bottom: 2rem; font-size: 0.95rem; }

    .input-group { display: flex; flex-direction: column; gap: 0.8rem; width: 100%; }

    .code-input {
      padding: 0.8rem; border-radius: 12px; border: 1px solid #ddd;
      font-size: 1rem; text-align: center; outline: none; transition: border 0.2s;
    }
    .code-input:focus { border-color: #ff6b35; }

    .btn-action {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; border: none; padding: 0.8rem; border-radius: 12px;
      font-weight: 700; cursor: pointer; width: 100%; transition: opacity 0.2s;
    }
    .btn-action:disabled { background: #ddd; cursor: not-allowed; }
    .btn-action.full { margin-top: auto; }

    .divider-vertical {
      display: flex; align-items: center; color: #999; font-weight: 700; font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .cards-container { flex-direction: column; }
      .divider-vertical { display: none; }
    }
  `]
})
export class RoleSelectionPage {
  invitationCode: string = '';
  constructor(private router: Router) {}

  registerAsOwner() {
    if (this.invitationCode.trim()) {
      this.router.navigate(['/sign-up'], {queryParams: {invitationCode: this.invitationCode.trim()}});
    }
  }

  registerAsMechanic() {
    this.router.navigate(['/sign-up']);
  }
}
