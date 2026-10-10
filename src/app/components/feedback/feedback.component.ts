import { Component, Input } from '@angular/core';
import { feedback } from '../feedback-form/feedback-form.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent {

  @Input() feedback:feedback | null = null;

  get mood(): string {
    switch (this.feedback?.satisfactory) {
      case 'Delighted': return 'good';
      case 'Not at all': return 'bad';
      default: return 'neutral';
    }
  }

}
