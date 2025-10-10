import {Component, Input} from '@angular/core';
import {Subscription} from '../../model/subscription.entity';
import {SubscriptionCardDialog} from '../subscription-card-dialog/subscription-card-dialog';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-subscription-card',
  imports: [],
  templateUrl: './subscription-card.html',
  styleUrl: './subscription-card.css'
})
export class SubscriptionCard {
  @Input() subscription!: Subscription;

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(SubscriptionCardDialog, {
      data: { subscription: this.subscription }
    });
  }
}
