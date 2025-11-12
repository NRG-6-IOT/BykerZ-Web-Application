import {Injectable, signal} from '@angular/core';
import {ProfilesApi} from '@app/iam/infrastructure/profiles-api';
import {Profile} from '@app/iam/domain/model/profile.entity';
import {retry} from 'rxjs';
import {AuthenticationService} from '@app/iam/services/authentication.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class ProfileStore {
  private activeProfileSignal = signal<Profile | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private profilesApi: ProfilesApi, private authenticationService: AuthenticationService) {
    this.authenticationService.currentUserId.pipe(takeUntilDestroyed())
      .subscribe(userId => {
        if (userId && userId > 0) {
          this.profilesApi.getProfileByUserId(userId)
            .pipe(takeUntilDestroyed())
            .subscribe({
              next: profile => this.activeProfileSignal.set(profile),
              error: () => this.activeProfileSignal.set(null)
            });
        } else {
          this.activeProfileSignal.set(null);
        }
      })
  }

  getProfileByUserId(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profilesApi.getProfileByUserId(id).pipe(retry(2)).subscribe({
      next: profile => {
        this.activeProfileSignal.set(profile);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load profile'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Resets the entire store state (useful for sign-out)
   */
  reset(): void {
    this.activeProfileSignal.set(null);
    this.errorSignal.set(null);
    this.loadingSignal.set(false);
  }

  private formatError(error: any, fallback: string): string {
    if(error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
