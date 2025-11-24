import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NgForOf} from '@angular/common';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [
    NgForOf,
    MatButtonToggleGroup,
    MatButtonToggle

  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcherComponent {
  currentLang: string = 'en';
  languages: string[] = ['en', 'es'];
  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;
  }

  useLanguage(lang: string) {
    this.translate.use(lang);
  }
}
