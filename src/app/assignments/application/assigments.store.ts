import {Injectable, signal} from "@angular/core";
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {retry} from 'rxjs';
import {AssignmentsApi} from '@app/assignments/infrastructure/assignments-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class AssignmentsStore {
  private activeAssignmentsSignal = signal<Assignment[]>([]);
  private pendingAssignmentsSignal = signal<Assignment[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly activeAssignments = this.activeAssignmentsSignal.asReadonly();
  readonly pendingAssignments = this.pendingAssignmentsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private assignmentsApi: AssignmentsApi) {
    this.loadActiveAssignments();
    this.loadPendingAssignments()
  }

  deleteAssignment(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.deleteAssignment(id).pipe(retry(1)).subscribe({
      next: () => {
        this.activeAssignmentsSignal.update(assignments => assignments.filter(a => a.id !== id));
        this.pendingAssignmentsSignal.update(assignments => assignments.filter(a => a.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete assignment'));
        this.loadingSignal.set(false);
      }
    })
  }

  createAssignment(mechanicId: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.createAssignment(mechanicId).pipe(retry(2)).subscribe({
      next: createdAssigment =>{
        this.pendingAssignmentsSignal.update(pendingAssignments => [createdAssigment, ...pendingAssignments]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create assignment'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadActiveAssignments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.getAssignmentsByMechanicAndStatus(1,'ACTIVE').pipe(takeUntilDestroyed()).subscribe(
      {
        next: assignments =>{
         this.activeAssignmentsSignal.set(assignments);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load courses'));
          this.loadingSignal.set(false);
        }
      }
    )
  }

  private loadPendingAssignments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.getAssignmentsByMechanicAndStatus(1,'PENDING').pipe(takeUntilDestroyed()).subscribe(
      {
        next: assignments =>{
          this.pendingAssignmentsSignal.set(assignments);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load courses'));
          this.loadingSignal.set(false);
        }
      }
    )
  }

  private formatError(error: any, fallback: string): string {
    if(error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
