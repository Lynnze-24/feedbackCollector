import { Component, Input, OnChanges } from '@angular/core';
import { initials } from 'src/app/utils/insights';

// Photo when there is a working URL, otherwise coloured initials.
@Component({
  selector: 'app-avatar',
  template: `
    <img *ngIf="src && !failed; else fallback" [src]="src" [alt]="name" (error)="failed = true"
         [style.width.rem]="size" [style.height.rem]="size" />
    <ng-template #fallback>
      <span class="letters" [style.width.rem]="size" [style.height.rem]="size"
            [style.font-size.rem]="size * 0.38" [style.background]="color" aria-hidden="true">{{ letters }}</span>
    </ng-template>
  `,
  styles: [`
    :host { display: inline-flex; flex: none; }
    img { border-radius: 50%; object-fit: cover; }
    .letters { display: grid; place-items: center; border-radius: 50%; color: #fff; font-weight: 600; }
  `],
})
export class AvatarComponent implements OnChanges {
  @Input() name = '';
  @Input() src: string | null | undefined = '';
  @Input() size = 2.25;

  failed = false;
  letters = '';
  color = '';

  private static palette = ['#0f8f7a', '#2563eb', '#7c3aed', '#db2777', '#ea580c', '#0891b2', '#4d7c0f'];

  ngOnChanges(): void {
    this.failed = false;
    this.letters = initials(this.name) || '?';
    const hash = [...this.name].reduce((h, c) => h + c.charCodeAt(0), 0);
    this.color = AvatarComponent.palette[hash % AvatarComponent.palette.length];
  }
}
