import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { fUser, UserService } from 'src/app/services/userService/user.service';

// Row actions: open the customer (to view or record feedback) and delete.
@Component({
  selector: 'app-grid-btn',
  templateUrl: './grid-btn.component.html',
  styleUrls: ['./grid-btn.component.css']
})
export class GridBtnComponent implements ICellRendererAngularComp {
  user: fUser | null = null;

  constructor(private userService: UserService) { }

  agInit(params: ICellRendererParams<fUser>): void {
    this.user = params.data ?? null;
  }

  // Called when the row's data changes (e.g. feedback was just saved),
  // so the label switches from "Add feedback" to "View" without a reload.
  refresh(params: ICellRendererParams<fUser>): boolean {
    this.user = params.data ?? null;
    return true;
  }

  open() {
    if (this.user) this.userService.onDetailClicked.next(this.user);
  }

  remove() {
    if (this.user) this.userService.onDeleteClicked.next(this.user);
  }
}
