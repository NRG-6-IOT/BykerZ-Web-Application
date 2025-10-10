import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subscription} from '../../model/subscription.entity';

@Component({
  selector: 'app-subscription-card-dialog',
  imports: [],
  templateUrl: './subscription-card-dialog.html',
  styleUrl: './subscription-card-dialog.css'
})
export class SubscriptionCardDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { subscription: Subscription }) {}
  onClick(){

  }

}
