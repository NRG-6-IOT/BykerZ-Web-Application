import {computed, Injectable, Signal, signal} from "@angular/core";
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {Observable, retry} from 'rxjs';
import {AssignmentsApi} from '@app/assignments/infrastructure/assignments-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class AssignmentsStore {
  private activeAssignmentsSignal = signal<Assignment[]>([]);
  private pendingAssignmentsSignal = signal<Assignment[]>([]);
  private createdAssignmentSignal = signal<Assignment | null>(null);
  private ownerAssignmentSignal = signal<Assignment | null>(null);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly activeAssignments = this.activeAssignmentsSignal.asReadonly();
  readonly pendingAssignments = this.pendingAssignmentsSignal.asReadonly();
  readonly createdAssignment = this.createdAssignmentSignal.asReadonly();
  readonly ownerAssignment = this.ownerAssignmentSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private assignmentsApi: AssignmentsApi) {
    this.reload()
  }

  reload() {
    this.loadActiveAssignments();
    this.loadPendingAssignments();
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
        this.createdAssignmentSignal.set(createdAssigment);
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
    const mechanicId = localStorage.getItem('role_id')
    if (mechanicId) {
      this.assignmentsApi.getAssignmentsByMechanicAndStatus(+mechanicId, 'ACTIVE').subscribe(
        {
          next: assignments => {
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
  }

  private loadPendingAssignments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const mechanicId = localStorage.getItem('role_id')
    if (mechanicId)
    {
      this.assignmentsApi.getAssignmentsByMechanicAndStatus(+mechanicId,'PENDING').subscribe(
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


  }

  getAssignmentById(id: number | null | undefined): Signal<Assignment | undefined> {
    return computed(() => id ? this.activeAssignments().find(c => c.id === id) : undefined);
  }

  getAssignmentByOwnerId(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.getAssignmentByOwner(id).pipe(retry(2)).subscribe({
      next: assignment =>{
        this.ownerAssignmentSignal.set(assignment);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load assignment for owner'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateAssignmentType(assignmentId: number, assignmentType: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.updateAssignmentType(assignmentId, assignmentType).pipe(retry(1)).subscribe({
      next: updatedAssignment => {
        this.activeAssignmentsSignal.update(assignments =>
          assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a)
        );
        this.pendingAssignmentsSignal.update(assignments =>
          assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update assignment type'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Resets the entire store state (useful for sign-out)
   */
  reset(): void {
    this.activeAssignmentsSignal.set([]);
    this.pendingAssignmentsSignal.set([]);
    this.createdAssignmentSignal.set(null);
    this.ownerAssignmentSignal.set(null);
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
