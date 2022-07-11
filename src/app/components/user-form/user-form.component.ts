import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit,OnDestroy {
  @ViewChild(NgForm) userForm:NgForm = {} as NgForm;
  @Input() onHideModal:Subject<void> = {} as Subject<void>;
  hideSub: Subscription = {} as Subscription;
  showPw:boolean = false;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.hideSub = this.onHideModal.subscribe(()=>{
      this.clearForm();
    })
   
  }

  onSubmit(){
    let newUser = this.userForm.value;
    newUser.phone = `+${newUser.phone}`;
    newUser.id = this.userService.generateFakeID();
  
    this.userService.createUser(newUser);
    this.clearForm()
  }

  clearForm(){
    this.userForm.resetForm()
  }

  ngOnDestroy(){
    this.hideSub.unsubscribe()
  }
  

}
