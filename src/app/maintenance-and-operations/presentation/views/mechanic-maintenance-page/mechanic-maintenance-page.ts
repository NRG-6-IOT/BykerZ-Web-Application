import {Component, computed, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {CreateExpenseDialog} from '@app/maintenance-and-operations/presentation/components/create-expense-dialog/create-expense-dialog';
import {MaintenanceStore} from '@app/maintenance-and-operations/application/maintenance.store';
import {ExpenseStore} from '@app/maintenance-and-operations/application/expense.store';
import {Maintenance} from '@app/maintenance-and-operations/domain/model/mainteance.entity';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-mechanic-maintenance-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, TranslateModule],
  template: `
    <div class="page">
      <div class="header">
        <div class="badge">{{ 'mechanic' | translate }}</div>
        <h1 class="page-title">{{ 'navbar.mechanic.maintenance' | translate }}</h1>
        <button class="btn-primary" (click)="navigateToCreateMaintenance()">
          + Create Maintenance
        </button>
      </div>

      <div *ngIf="maintenanceStore.loading()" class="status-msg">Loading...</div>
      <div *ngIf="maintenanceStore.error()" class="status-msg error">{{maintenanceStore.error()}}</div>

      <h2 class="section-title">Active Requests</h2>
      <div class="grid-container">
        <div class="empty-state" *ngIf="scheduledMaintenances().length === 0">No scheduled maintenances</div>

        <div class="card" *ngFor="let maintenance of scheduledMaintenances(); trackBy: trackById">
          <div class="card-header-gradient">
            <span class="card-date">{{maintenance.dateOfService | date:'short'}}</span>
            <span class="location-badge">📍 {{maintenance.location}}</span>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Vehicle ID</span>
                <span class="value">#{{maintenance.vehicleId}}</span>
              </div>
              <div class="info-item">
                <span class="label">Details</span>
                <span class="value">{{maintenance.details}}</span>
              </div>
            </div>

            <div class="status-control">
              <span class="label">Update Status:</span>
              <div class="control-row">
                <select [(ngModel)]="maintenance.state" class="status-select" [ngClass]="maintenance.state">
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <button class="btn-save" (click)="saveMaintenanceState(maintenance)" [disabled]="maintenanceStore.loading()">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 class="section-title mt-5">History</h2>
      <div class="grid-container">
        <div class="empty-state" *ngIf="completedMaintenances().length === 0">No completed maintenances</div>

        <div class="card done" *ngFor="let maintenance of completedMaintenances(); trackBy: trackById">
          <div class="card-header-gradient dark">
            <span class="card-date">{{maintenance.dateOfService | date:'shortDate'}}</span>
            <span class="status-badge">{{maintenance.state}}</span>
          </div>
          <div class="card-body">
            <p class="summary-text">{{maintenance.details}}</p>
            <div class="expense-preview" *ngIf="maintenance.expense">
              <span class="label">Total Cost</span>
              <span class="cost">$ {{maintenance.expense.finalPrice | number:'1.2-2'}}</span>
              <button class="link-btn" (click)="navigateToExpenseDetails(maintenance.expense.id)">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px; margin: 0 auto; padding: 2rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      min-height: 100vh; animation: fadeIn 0.5s ease-in;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .header { text-align: center; margin-bottom: 3rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }

    .badge {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      color: white; padding: 0.3rem 1rem; border-radius: 20px;
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    }

    .page-title {
      font-size: 2rem; font-weight: 800; color: #1a1a1a; margin: 0;
      letter-spacing: -0.5px;
    }

    .btn-primary {
      background: #1a1a1a; color: white; border: none; padding: 0.8rem 1.5rem;
      border-radius: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
    .btn-primary:hover { background: #333; transform: translateY(-2px); }

    .section-title { font-size: 1.5rem; border-left: 4px solid #ff6b35; padding-left: 0.75rem; margin: 2rem 0 1rem; }
    .mt-5 { margin-top: 3rem; }

    .grid-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }

    .card {
      background: white; border-radius: 16px; overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08); transition: transform 0.3s;
    }
    .card:hover { transform: translateY(-4px); }
    .card.done { opacity: 0.9; }

    .card-header-gradient {
      background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
      padding: 1rem; display: flex; justify-content: space-between; align-items: center; color: white;
    }
    .card-header-gradient.dark { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); }

    .card-body { padding: 1.5rem; }

    .info-grid { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.5rem; }
    .info-item { display: flex; justify-content: space-between; border-bottom: 1px solid #f0f0f0; padding-bottom: 0.5rem; }
    .label { font-size: 0.75rem; text-transform: uppercase; color: #999; font-weight: 600; }
    .value { font-weight: 600; color: #333; }

    .status-control { background: #f9f9f9; padding: 1rem; border-radius: 12px; }
    .control-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

    .status-select {
      flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid #ddd;
      font-weight: 600; font-size: 0.9rem;
    }
    /* Simple status coloring for select */
    .status-select.PENDING { color: #d97706; background: #fef3c7; }
    .status-select.IN_PROGRESS { color: #1d4ed8; background: #dbeafe; }
    .status-select.COMPLETED { color: #15803d; background: #dcfce7; }
    .status-select.CANCELLED { color: #b91c1c; background: #fee2e2; }

    .btn-save {
      background: #ff6b35; color: white; border: none; padding: 0 1rem;
      border-radius: 8px; font-weight: 600; cursor: pointer;
    }
    .btn-save:hover { background: #e55a2b; }

    .expense-preview {
      margin-top: 1rem; display: flex; align-items: center; justify-content: space-between;
      background: #fff5f0; padding: 0.75rem; border-radius: 8px;
    }
    .cost { font-weight: 700; color: #ff6b35; }
    .link-btn { background: none; border: none; color: #666; text-decoration: underline; cursor: pointer; font-size: 0.8rem; }

    .status-msg { text-align: center; padding: 2rem; color: #666; }
    .status-msg.error { color: red; }
    .empty-state { grid-column: 1 / -1; text-align: center; color: #999; padding: 2rem; background: white; border-radius: 16px; }
  `]
})
export class MechanicMaintenancePage implements OnInit {
  readonly maintenanceStore = inject(MaintenanceStore);
  readonly expenseStore = inject(ExpenseStore);
  readonly router = inject(Router);
  readonly dialog = inject(MatDialog);
  readonly http = inject(HttpClient);

  readonly scheduledMaintenances = computed(() => this.maintenanceStore.scheduledMaintenances());
  readonly completedMaintenances = computed(() => this.maintenanceStore.completedMaintenances());

  ngOnInit(): void { this.loadMaintenances(); }
  trackById(index: number, item: any) { return item.id; }

  private loadMaintenances(): void {
    const roleId = localStorage.getItem('role_id');
    if (roleId) this.maintenanceStore.loadMaintenancesByMechanicId(parseInt(roleId, 10));
  }

  saveMaintenanceState(maintenance: Maintenance): void {
    if (maintenance.state === 'COMPLETED') {
      this.handleCompletedState(maintenance);
    } else {
      this.maintenanceStore.updateMaintenanceStatus(maintenance.id, maintenance.state);
    }
  }

  private handleCompletedState(maintenance: Maintenance): void {
    this.dialog.open(CreateExpenseDialog, {
      width: 'auto', maxWidth: 'none', panelClass: 'custom-expense-dialog'
    }).afterClosed().subscribe((expenseData: any) => {
      if (expenseData) {
        this.createExpenseForMaintenance(maintenance, expenseData);
      } else {
        maintenance.state = 'IN_PROGRESS';
      }
    });
  }

  private createExpenseForMaintenance(maintenance: Maintenance, expenseData: any): void {
    this.getOwnerIdByVehicleId(maintenance.vehicleId).subscribe({
      next: ({id}) => {
        this.expenseStore.createExpense(id, { ...expenseData, expenseType: 'MAINTENANCE' });
        setTimeout(() => {
          const expenses = this.expenseStore.expenses();
          if (expenses.length > 0) {
            this.maintenanceStore.assignExpenseToMaintenance(maintenance.id, expenses[0].id);
            setTimeout(() => this.maintenanceStore.updateMaintenanceStatus(maintenance.id, 'COMPLETED'), 500);
          }
        }, 500);
      },
      error: () => maintenance.state = 'IN_PROGRESS'
    });
  }

  private getOwnerIdByVehicleId(vehicleId: number) {
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('token')}` });
    return this.http.get<{id: number, completeName: string}>(
      `${environment.platformProviderApiBaseUrl}/owners/vehicle/${vehicleId}`, { headers }
    );
  }

  navigateToExpenseDetails(expenseId: number): void { this.router.navigate(['/expenses', expenseId]); }
  navigateToCreateMaintenance(): void { this.router.navigate(['/maintenances/mechanic/create']); }
}
