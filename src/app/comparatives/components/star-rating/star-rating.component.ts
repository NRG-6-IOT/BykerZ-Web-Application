import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="star-rating">
      <span *ngFor="let star of stars"
            class="star"
            [class.filled]="star <= rating">
        ★
      </span>
      <span class="rating-value">{{ rating.toFixed(1) }}</span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .star {
      font-size: 1.2rem;
      color: #ddd;
      transition: color 0.2s;
    }
    .star.filled {
      color: #ffc107;
    }
    .rating-value {
      margin-left: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #666;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
}

