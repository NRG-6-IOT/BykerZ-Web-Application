import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-star-rating',
  template: `
    <div class="stars" aria-hidden="true">
      <span *ngFor="let s of starsArray; let i = index" class="star"
            [ngClass]="{ 'full': s === 'full', 'half': s === 'half', 'empty': s === 'empty' }">
        ★
      </span>
    </div>
  `,
  styles: [`
    :host { display: inline-block; font-size: 18px; line-height: 1; }
    .stars { color: currentColor; }
    .star { margin-right: 2px; display:inline-block; position:relative; }
    .star.empty { color: #ddd; }
    .star.half { color: #ddd; }
    .star.half::before {
      content: '★';
      position: absolute;
      left: 0;
      width: 50%;
      overflow: hidden;
      color: currentColor;
    }
  `]
})
export class StarRatingComponent {
  @Input() score: number = 0;

  get starsArray(): ('full'|'half'|'empty')[] {
    const safeScore = this.score ?? 0;
    const normalized = Math.max(0, Math.min(10, safeScore));
    const scaled = normalized / 2; // 0..5
    const full = Math.floor(scaled);
    const half = (scaled - full) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return [
      ...Array(full).fill('full'),
      ...Array(half).fill('half'),
      ...Array(empty).fill('empty')
    ] as any;
  }
}
