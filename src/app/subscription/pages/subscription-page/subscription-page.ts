import { Component } from '@angular/core';
import {SubscriptionCardList} from '../../components/subscription-card-list/subscription-card-list';
import {Owner, Subscription} from '../../model/subscription.entity';

@Component({
  selector: 'app-subscription-page',
  imports: [
    SubscriptionCardList
  ],
  templateUrl: './subscription-page.html',
  styleUrl: './subscription-page.css'
})
export class SubscriptionPage {
  subscriptions: Array<Subscription> = [];

  ngOnInit(): void {
    this.subscriptions = [
      new Subscription(1, 'Frequent Customer', new Owner(1, 'Ana Torres'), 2),
      new Subscription(2, 'Regular Customer', new Owner(2, 'Luis Pérez'), 1),
      new Subscription(3, 'Business Customer', new Owner(3, 'María Gómez'), 3),
      new Subscription(4, 'New Customer', new Owner(4, 'Carlos Ruiz'), 4),
      new Subscription(5, 'Occasional Customer', new Owner(5, 'Elena Díaz'), 2),
    ];
  }
}
