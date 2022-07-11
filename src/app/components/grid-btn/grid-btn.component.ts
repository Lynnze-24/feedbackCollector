import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { fUser, UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-grid-btn',
  templateUrl: './grid-btn.component.html',
  styleUrls: ['./grid-btn.component.css']
})
export class GridBtnComponent implements OnInit,ICellRendererAngularComp {
  id:string = '';
 

  constructor(private userService: UserService) { }

  agInit(params:ICellRendererParams):void{
    this.id = params.value;
  }

  refresh(params:ICellRendererParams):boolean{
    return false;
  }

  ngOnInit(): void {
  }

  onClick(){
    let item = this.userService.users.find((x)=> x.id=== this.id);
    if(item){
      this.userService.onDetailClicked.next(item)
    }
  }

}
