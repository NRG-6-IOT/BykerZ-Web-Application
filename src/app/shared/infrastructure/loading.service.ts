import {EventEmitter, Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {LoadingDialog} from '@app/shared/presentation/components/loading-dialog/loading-dialog';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  dialogRef: MatDialogRef<LoadingDialog> | undefined;

  constructor(private dialog: MatDialog) { }

  LoadingDialog(stopEmitter: EventEmitter<any>): void
  {
    let ref = this.dialog.open(LoadingDialog, {
      hasBackdrop: true,
      disableClose: true,
      enterAnimationDuration: '50ms',
      exitAnimationDuration: '50ms',
    })

    stopEmitter.subscribe(() => {
      ref.close();
      stopEmitter.unsubscribe()
    })
  }
}
