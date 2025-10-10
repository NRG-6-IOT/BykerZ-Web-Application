import {Component, Input} from '@angular/core';
import {Subscription} from '../../model/subscription.entity';

@Component({
  selector: 'app-subscription-card',
  imports: [],
  templateUrl: './subscription-card.html',
  styleUrl: './subscription-card.css'
})
export class SubscriptionCard {
  @Input() subscription!: Subscription;
}
