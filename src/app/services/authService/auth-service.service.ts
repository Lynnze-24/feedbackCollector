import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

interface rUser{
  email: string;
  password:string;
}

export interface authMessage{
   message: string;
   type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceComponent  {
  registeredUsers:rUser[] = [{email:'a@gmail.com',password:'aa'}];
  authMessage = new Subject<authMessage>();
  private isLoggedIn:boolean = false;

  constructor(private router:Router) {
    
    const localUsers:string | null = localStorage.getItem('rUser');
    const loginState:string | null = localStorage.getItem('isLoggedIn');
    
    if(loginState){
      this.isLoggedIn = loginState==='true'?true:false;
     
    }
    if(localUsers){
      this.registeredUsers = JSON.parse(localUsers) 
    }
  }

  

  getState():boolean{
    return this.isLoggedIn;
  }

  login(email:string,password:string){
    const item = this.registeredUsers.find((x)=> x.email === email)
    if(!item){
      this.authMessage.next({
        message:'Account does not exist',
        type: 'error'
      });
      return;
    }
    if(item?.password!==password){
      this.authMessage.next({
        message:'You entered a wrong password',
        type: 'error'
      });
      return
    }
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn','true');
    this.authMessage.next({}as authMessage)    // clear authMessage
    this.router.navigate(['/']);
  }

  logout(){
    this.isLoggedIn = false;
    localStorage.setItem('isLoggedIn','false');
    this.router.navigate(['/auth']);
  }

  signUp(email:string,password:string){
    const item = this.registeredUsers.find((x)=> x.email === email);
    if(item){
      this.authMessage.next({
        message:'Account with this email already exists',
        type: 'error'
      });
      return;
    }
    this.registeredUsers.push({email, password})
    localStorage.setItem('rUser',JSON.stringify(this.registeredUsers))
    this.authMessage.next({
      message:'Account created successfully! Please Sign in',
      type: 'success'
    });
  }

}
