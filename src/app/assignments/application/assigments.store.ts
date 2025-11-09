import {Injectable, signal} from "@angular/core";
import {Assignment} from '@app/assignments/domain/model/assignment.entity';
import {delay} from 'rxjs';
import {Owner} from '@app/assignments/domain/model/owner.entity';
import {AssignmentsApi} from '@app/assignments/infrastructure/assignments-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({providedIn: 'root'})
export class AssignmentsStore {
  private assignmentsSignal = signal<Assignment[]>([]);
  private readonly errorSignal = signal<string | null>(null);
  private readonly loadingSignal = signal<boolean>(false);

  readonly assignments = this.assignmentsSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  constructor(private assignmentsApi: AssignmentsApi) {
    this.loadAssignments();
  }

  private loadAssignments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.assignmentsApi.getAssignmentsByMechanicAndStatus(1,'ACTIVE').pipe(takeUntilDestroyed()).subscribe(
      {
        next: assignments =>{
         this.assignmentsSignal.set(assignments);
          this.loadingSignal.set(false);
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load courses'));
          this.loadingSignal.set(false);
        }
      }
    )
    /*
    setTimeout(() => {
      try {
        const fetchedAssignments: Assignment[] = [
          new Assignment(1, 'Frequent Customer', new Owner(1, 'Ana Torres'), 2),
          new Assignment(2, 'Regular Customer', new Owner(2, 'Luis Pérez'), 1),
          new Assignment(3, 'Business Customer', new Owner(3, 'María Gómez'), 3),
          new Assignment(4, 'New Customer', new Owner(4, 'Carlos Ruiz'), 4),
          new Assignment(5, 'Occasional Customer', new Owner(5, 'Elena Díaz'), 2),
        ];
        this.assignmentsSignal.set(fetchedAssignments);
      } catch (err) {
        this.errorSignal.set(this.formatError(err, 'Error cargando assignments'));
      } finally {
        this.loadingSignal.set(false);
      }
    }, 2000);
     */
  }

  private formatError(error: any, fallback: string): string {
    if(error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
