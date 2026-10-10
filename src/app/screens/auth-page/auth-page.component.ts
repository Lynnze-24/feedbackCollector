import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthServiceComponent, authMessage, DEMO_ACCOUNT } from 'src/app/services/authService/auth-service.service';


@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css'],
})
export class AuthPageComponent implements OnInit,OnDestroy {

  @ViewChild(NgForm) formVal:NgForm = {} as NgForm;
  showPw:boolean = false;
  isLoginMode:boolean = true;
  authMessage:authMessage = {} as authMessage;
  authSub: Subscription = new Subscription();
  demo = DEMO_ACCOUNT;

  constructor(private authService: AuthServiceComponent) { }

  ngOnInit(): void {
    this.authSub = this.authService.authMessage.subscribe((msg)=>{
        this.authMessage= msg;
    })
  }

  onSubmit(){
    if(this.formVal.status!=='VALID')return;
    const { email, password } = this.formVal.value;

    if(this.isLoginMode){
      this.authService.login(email,password)
      this.formVal.resetForm({ email })
    }else if (this.authService.signUp(email,password)) {
      this.isLoginMode = true;
      this.formVal.resetForm({ email })
    }
  }

  useDemo(){
    this.authService.loginDemo();
  }

  switchMode(){
    this.isLoginMode = !this.isLoginMode;
    this.clearAuthMsg();
  }

  clearAuthMsg(){
    this.authService.authMessage.next({
      message:'',
      type: 'error'
    });
  }

  ngOnDestroy(){
    this.authSub.unsubscribe()
  }


}
