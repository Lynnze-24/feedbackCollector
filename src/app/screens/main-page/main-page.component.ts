import { Component, OnDestroy, OnInit, ViewChild,HostListener } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { Subject, Subscription } from 'rxjs';
import { feedback } from 'src/app/components/feedback-form/feedback-form.component';
import { GridBtnComponent } from 'src/app/components/grid-btn/grid-btn.component';
import { AuthServiceComponent } from 'src/app/services/authService/auth-service.service';
import { fUser, UserService } from 'src/app/services/userService/user.service';





@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit,OnDestroy {
  
  @ViewChild('grid') grid:AgGridAngular = {} as AgGridAngular;

  displayFbModal:boolean = false;
  displayUserModal:boolean = false;
  hasImageError:boolean = false;
  windowWidth:number = innerWidth;

  alertMessage:string = '';

  rowData:  fUser[] = this.userService.getUsers();

  onHideUserModal:Subject<void> = new Subject<void>();
  onHideFbModal:Subject<void> = new Subject<void>();

  detailSub: Subscription = {} as Subscription;
  newUserSub: Subscription = {} as Subscription;
  feedbackSub:Subscription = {} as Subscription;

  modalItem: fUser = {} as fUser;

  filterText:string = '';

  columnDefs: ColDef[] = [
    { field: 'name', width: this.windowWidth> 650? 120:100, },
    { field: 'email',flex:1,minWidth:this.windowWidth> 650?180:120,
      getQuickFilterText: () => {
        return '';
      } // convert to empty string because don't wanna filter this column
    },
    { field: 'phone',width:this.windowWidth> 650?140:110,
      getQuickFilterText: () => {
        return '';
      }// convert to empty string because don't wanna filter this column
    },
    {
      field: 'id',headerName:'Detail', width: 130, 
      cellRenderer: GridBtnComponent, 
      sortable: false,
      getQuickFilterText: () => {
        return '';
      }// convert to empty string because don't wanna filter this column
    },
  
  ];

  bigColSize: number[] = [120,180,140,130]
  mediumColSize: number[] = [100,120,110,130]
  smallColSize: number[] = [90,110,100,80]

  defaultColDef: ColDef= {
    sortable: true,
    filter: false,
    suppressMovable:true, // make it not draggable
    cellClass: 'no-border'  // custom css class to hide borders when click
  };


  @HostListener('window:resize')
  onResize() {
    // Code to execute when window is resized
    console.log(this.columnDefs,'resize')
    if(innerWidth > 650){
        this.columnDefs = this.columnDefs.map((x,i )=> {
          if(i!==1){
            x.width = this.bigColSize[i]
          }else{
            x.minWidth = this.bigColSize[i]
          }
          
          return x;
        })
    }else if(innerWidth > 500){
        this.columnDefs = this.columnDefs.map((x,i )=> {
          if(i!==1){
            x.width = this.mediumColSize[i]
          }else{
            x.minWidth = this.mediumColSize[i]
          }
          return x;
        })
    }else{
        this.columnDefs = this.columnDefs.map((x,i )=> {
          if(i!==1){
            x.width = this.smallColSize[i]
          }else{
            x.minWidth = this.smallColSize[i]
          }
          return x;
        })
    }
    
  } 

  constructor(private authService:AuthServiceComponent,
              private userService:UserService) { }

   

  ngOnInit(): void {
    this.detailSub = this.userService.onDetailClicked.subscribe(
      (item)=>{
          if(item!==null){
            this.hasImageError = false;
             this.displayFbModal = true;
             this.modalItem = item;
          }
      }
    )
    this.newUserSub = this.userService.onCreateUser.subscribe(
      ()=>{
          this.rowData= this.userService.getUsers();
          this.displayUserModal = false;
          this.alertMessage = 'User Created successfully!';
      }
    )

    this.feedbackSub = this.userService.onFeedbackSuccess.subscribe(
      (str)=>{
        this.alertMessage = str;   
      }
    )
  
  
    
  }

  logOut():void{
    this.authService.logout()
  }

  onFeedback(fb:feedback){
    this.displayFbModal = false;
    const id = this.modalItem.id;
    if(!id)return;
    console.log(id)
    this.userService.addFeedback(id,fb)
  }

  openUserModal(){
    this.displayUserModal = true;
  }

  onImageError(){
    this.hasImageError = true;
  }

  userModalHide(){
    this.onHideUserModal.next();
  }

  fbModalHide(){
    this.onHideFbModal.next();
  }

  changeFilter(){
    this.grid.api.setQuickFilter(this.filterText);
  }

  clearSearch(){
    this.filterText= '';
    this.grid.api.setQuickFilter(this.filterText);
  }

  clearAlertMsg(){
    this.alertMessage = '';
  }

  ngOnDestroy(){
    this.detailSub.unsubscribe()
    this.newUserSub.unsubscribe()

    
  }


}
