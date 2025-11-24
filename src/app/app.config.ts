import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideNativeDateAdapter} from '@angular/material/core';
import {HttpClient, provideHttpClient, withInterceptors} from '@angular/common/http';
import {authenticationInterceptor} from '@app/iam/services/authentication.interceptor';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {firstValueFrom} from 'rxjs';

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return {
    getTranslation: (lang: string) => http.get(`/assets/i18n/${lang}.json`)
  } as TranslateLoader;
}

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    translate.setDefaultLang('en');
    return firstValueFrom(translate.use('en'));
  };
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideNativeDateAdapter(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        }
      })
    ),
    { provide: APP_INITIALIZER, useFactory: appInitializerFactory, deps: [TranslateService], multi: true }
  ]
};
