import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-maintenance-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatDialogModule],
  template: `
    <div class="dialog-card">
      <div class="dialog-header">
        <h3>{{ 'maintenance.detailsLabel' | translate }}</h3>
        <button class="close-btn" (click)="close()">×</button>
      </div>

      <div class="dialog-body">
        <div class="info-row" *ngIf="data?.details">
          <span class="label">{{ 'maintenance.create.description' | translate }}</span>
          <p class="value">{{ data.details }}</p>
        </div>

        <div class="placeholder-content" *ngIf="!data">
          <p>{{ 'maintenance.noHistory' | translate }}</p>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn-close" (click)="close()">{{ 'common.back' | translate }}</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-card {
      background: white; border-radius: 16px; overflow: hidden;
      min-width: 400px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .dialog-header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 1.25rem 1.5rem; color: white; display: flex; justify-content: space-between; align-items: center;
    }
    .dialog-header h3 { margin: 0; font-weight: 700; color: #ff6b35; font-size: 1.1rem; }

    .close-btn {
      background: none; border: none; color: rgba(255,255,255,0.5);
      font-size: 1.5rem; cursor: pointer; line-height: 1;
    }
    .close-btn:hover { color: white; }

    .dialog-body { padding: 1.5rem; }

    .info-row { margin-bottom: 1rem; }
    .label { display: block; font-size: 0.75rem; color: #999; text-transform: uppercase; font-weight: 700; margin-bottom: 0.25rem; }
    .value { margin: 0; color: #333; font-weight: 500; }

    .dialog-footer {
      padding: 1rem 1.5rem; border-top: 1px solid #f0f0f0; background: #fafafa;
      text-align: right;
    }

    .btn-close {
      background: white; border: 1px solid #ddd; padding: 0.5rem 1.25rem;
      border-radius: 8px; font-weight: 600; color: #666; cursor: pointer;
    }
    .btn-close:hover { background: #f0f0f0; color: #333; }
  `],
})
export class MaintenanceDialog {
  constructor(
    public dialogRef: MatDialogRef<MaintenanceDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
