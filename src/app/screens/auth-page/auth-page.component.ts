import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceComponent,authMessage } from 'src/app/services/authService/auth-service.service';




@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AuthPageComponent implements OnInit,OnDestroy {

  @ViewChild(NgForm) formVal:NgForm = {} as NgForm;
  showPw:boolean = false;
  isLoginMode:boolean = true;
  authMessage:authMessage = {} as authMessage;
  authSub: Subscription = { } as Subscription;

  constructor(private authService: AuthServiceComponent) { }

  ngOnInit(): void {
    this.authSub = this.authService.authMessage.subscribe((msg)=>{
        this.authMessage= msg;
    })
  }

  onSubmit(){
    let email = this.formVal.value.email;
    let password = this.formVal.value.password;
    if(this.formVal.status!=='VALID')return;
    
    if(this.isLoginMode){
      this.authService.login(email,password)
    }else{
      this.authService.signUp(email,password)
      this.isLoginMode = true;
    }
    this.resetForm()
  }

  clearAuthMsg(){
    this.authService.authMessage.next({
      message:'',
      type: 'error'
    });
  }


  resetForm(){
   this.formVal.resetForm()
  }

  ngOnDestroy(){
    this.authSub.unsubscribe()
  }


}
