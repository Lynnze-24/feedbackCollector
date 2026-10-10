import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { fUser } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-customer-cell',
  template: `
    <div class="customer" *ngIf="user">
      <app-avatar [name]="user.name" [src]="user.avatar"></app-avatar>
      <div class="text">
        <span class="name">{{ user.name }}</span>
        <span class="email">{{ user.email }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; min-width: 0; }
    .customer { display: flex; align-items: center; gap: 0.75rem; width: 100%; height: 100%; min-width: 0; overflow: hidden; }
    .text { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
    .name { font-weight: 600; color: var(--ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .email { font-size: 0.8rem; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `],
})
export class CustomerCellComponent implements ICellRendererAngularComp {
  user: fUser | null = null;

  agInit(params: ICellRendererParams<fUser>): void {
    this.user = params.data ?? null;
  }

  refresh(params: ICellRendererParams<fUser>): boolean {
    this.user = params.data ?? null;
    return true;
  }
}
