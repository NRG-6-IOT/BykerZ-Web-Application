import { Component, Input } from '@angular/core';
import {Subscription} from '../../model/subscription.entity';
import {SubscriptionCard} from '../subscription-card/subscription-card';

@Component({
  selector: 'app-subscription-card-list',
  imports: [
    SubscriptionCard
  ],
  templateUrl: './subscription-card-list.html',
  styleUrl: './subscription-card-list.css'
})
export class SubscriptionCardList {
  @Input() subscriptions: Array<Subscription> = [];
}
