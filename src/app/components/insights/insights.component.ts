import { Component, Input } from '@angular/core';
import { Insights } from 'src/app/utils/insights';

const MOOD_COLORS: Record<string, string> = {
  'Delighted': '#16a34a',
  'OK': '#3b82f6',
  'Undecided': '#a8a29e',
  'Not at all': '#ef4444',
};

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css'],
})
export class InsightsComponent {
  @Input() insights!: Insights;

  moodColor(label: string): string {
    return MOOD_COLORS[label] || '#94a3b8';
  }

  // Stars for the average, e.g. 3.6 -> 4 filled
  get filledStars(): number[] {
    return [1, 2, 3, 4, 5].map((i) => (this.insights.averageRating !== null && i <= Math.round(this.insights.averageRating) ? 1 : 0));
  }

  // Only name a top service when one clearly leads.
  get topService(): string | null {
    const [first, second] = [...this.insights.services].sort((a, b) => b.count - a.count);
    return first && first.count && (!second || first.count > second.count) ? first.label : null;
  }
}
