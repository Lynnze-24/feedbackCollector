import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GetRowIdParams, GridReadyEvent, GridSizeChangedEvent, RowNode, ValueGetterParams } from 'ag-grid-community';
import { ConfirmationService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { feedback } from 'src/app/components/feedback-form/feedback-form.component';
import { CustomerCellComponent } from 'src/app/components/customer-cell/customer-cell.component';
import { GridBtnComponent } from 'src/app/components/grid-btn/grid-btn.component';
import { AuthServiceComponent } from 'src/app/services/authService/auth-service.service';
import { fUser, UserService } from 'src/app/services/userService/user.service';
import { computeInsights, Insights, toCsv } from 'src/app/utils/insights';

type StatusFilter = 'all' | 'pending' | 'received';

const stars = (rating: number | null) =>
  rating ? `<span class="gridStars" title="${rating} out of 5">${'★'.repeat(rating)}<span>${'★'.repeat(5 - rating)}</span></span>` : '<span class="gridMuted">–</span>';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  providers: [ConfirmationService],
})
export class MainPageComponent implements OnInit,OnDestroy {

  @ViewChild(AgGridAngular) grid?: AgGridAngular<fUser>;

  users: fUser[] = [];
  insights: Insights = computeInsights([]);

  displayFbModal = false;
  displayUserModal = false;
  modalItem: fUser | null = null;

  filterText = '';
  statusFilter: StatusFilter = 'all';
  filters: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Received', value: 'received' },
  ];
  noRowsTemplate = '<span class="gridEmpty">No customers match your search.</span>';
  visibleCount = 0;

  alertMessage = '';
  private alertTimer?: ReturnType<typeof setTimeout>;

  userEmail = this.authService.currentEmail;

  onHideUserModal: Subject<void> = new Subject<void>();
  onHideFbModal: Subject<void> = new Subject<void>();

  private subs = new Subscription();

  columnDefs: ColDef<fUser>[] = [
    {
      headerName: 'Customer', field: 'name', flex: 2, minWidth: 190,
      cellRenderer: CustomerCellComponent,
      getQuickFilterText: (p) => `${p.data.name} ${p.data.email} ${p.data.phone}`,
    },
    {
      headerName: 'Location', colId: 'location', flex: 1, minWidth: 130,
      valueGetter: (p: ValueGetterParams<fUser>) => [p.data?.location?.city, p.data?.location?.country].filter(Boolean).join(', '),
    },
    {
      headerName: 'Rating', colId: 'rating', width: 120,
      valueGetter: (p: ValueGetterParams<fUser>) => p.data?.feedback?.rating ?? null,
      cellRenderer: (p: { value: number | null }) => stars(p.value),
      getQuickFilterText: () => '',
    },
    {
      headerName: 'Status', colId: 'status', width: 120,
      valueGetter: (p: ValueGetterParams<fUser>) => (p.data?.feedback ? 'Received' : 'Pending'),
      cellRenderer: (p: { value: string }) => `<span class="statusPill ${p.value.toLowerCase()}">${p.value}</span>`,
    },
    {
      headerName: '', colId: 'actions', width: 170, sortable: false,
      cellRenderer: GridBtnComponent,
      getQuickFilterText: () => '',
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: false,
    resizable: false,
    suppressMovable: true,
    cellClass: 'no-border',
  };

  getRowId = (params: GetRowIdParams<fUser>) => params.data.id;

  constructor(private authService:AuthServiceComponent,
              private userService:UserService,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.subs.add(this.userService.users$.subscribe((users) => {
      this.users = users;
      this.insights = computeInsights(users);
      if (this.modalItem) {
        this.modalItem = users.find((u) => u.id === this.modalItem?.id) ?? null;
      }
    }));

    this.subs.add(this.userService.onDetailClicked.subscribe((item) => {
      this.modalItem = item;
      this.displayFbModal = true;
    }));

    this.subs.add(this.userService.onDeleteClicked.subscribe((item) => this.confirmDelete(item)));
  }

  // Columns that matter least drop out first as the table gets narrow.
  onGridSizeChanged(event: GridSizeChangedEvent | GridReadyEvent) {
    const width = 'clientWidth' in event ? event.clientWidth : window.innerWidth;
    event.columnApi.setColumnsVisible(['location'], width > 760);
    event.columnApi.setColumnsVisible(['rating'], width > 620);
    event.columnApi.setColumnsVisible(['status'], width > 440);
    event.columnApi.setColumnWidth('actions', width > 560 ? 170 : 92);
    event.api.sizeColumnsToFit();
  }

  isExternalFilterPresent = () => this.statusFilter !== 'all';

  doesExternalFilterPass = (node: RowNode<fUser>) =>
    this.statusFilter === 'received' ? !!node.data?.feedback : !node.data?.feedback;

  setStatusFilter(filter: StatusFilter) {
    this.statusFilter = filter;
    this.grid?.api.onFilterChanged();
  }

  changeFilter() {
    this.grid?.api.setQuickFilter(this.filterText);
  }

  clearSearch() {
    this.filterText = '';
    this.changeFilter();
  }

  // The grid reports model changes mid change-detection, so update on the next tick.
  onModelUpdated() {
    setTimeout(() => {
      this.visibleCount = this.grid?.api ? this.grid.api.getDisplayedRowCount() : this.users.length;
    });
  }

  locationText(user: fUser): string {
    return [user.location?.city, user.location?.country].filter(Boolean).join(', ');
  }

  countBy(filter: StatusFilter): number {
    if (filter === 'all') return this.users.length;
    return this.users.filter((u) => (filter === 'received' ? !!u.feedback : !u.feedback)).length;
  }

  exportCsv() {
    const rows: fUser[] = [];
    this.grid?.api.forEachNodeAfterFilterAndSort((node) => node.data && rows.push(node.data));
    const blob = new Blob(['﻿' + toCsv(rows)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `insight-sphere-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.showAlert(`Exported ${rows.length} customer${rows.length === 1 ? '' : 's'} to CSV`);
  }

  confirmDelete(user: fUser) {
    this.confirmationService.confirm({
      header: 'Delete customer?',
      message: `${user.name} and their feedback will be removed. This can't be undone.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.deleteUser(user.id);
        if (this.modalItem?.id === user.id) this.displayFbModal = false;
        this.showAlert(`${user.name} was deleted`);
      },
    });
  }

  confirmReset() {
    this.confirmationService.confirm({
      header: 'Reset demo data?',
      message: 'This replaces all customers and feedback with the original sample data.',
      icon: 'pi pi-refresh',
      acceptLabel: 'Reset',
      rejectLabel: 'Cancel',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.resetDemo();
        this.showAlert('Demo data restored');
      },
    });
  }

  logOut():void{
    this.authService.logout()
  }

  onFeedback(fb:feedback){
    const id = this.modalItem?.id;
    if(!id)return;
    this.userService.addFeedback(id,fb)
    this.displayFbModal = false;
    this.showAlert('Feedback saved');
  }

  openUserModal(){
    this.displayUserModal = true;
  }

  onUserCreated() {
    this.displayUserModal = false;
    this.showAlert('Customer added');
  }

  userModalHide(){
    this.onHideUserModal.next();
  }

  fbModalHide(){
    this.onHideFbModal.next();
  }

  showAlert(message: string) {
    this.alertMessage = message;
    clearTimeout(this.alertTimer);
    this.alertTimer = setTimeout(() => (this.alertMessage = ''), 3500);
  }

  clearAlertMsg(){
    this.alertMessage = '';
  }

  ngOnDestroy(){
    this.subs.unsubscribe();
    clearTimeout(this.alertTimer);
  }

}
