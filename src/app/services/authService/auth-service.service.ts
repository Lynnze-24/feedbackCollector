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

// This is a front-end-only demo: accounts live in the visitor's own browser.
export const DEMO_ACCOUNT: rUser = { email: 'demo@insightsphere.app', password: 'demo1234' };

@Injectable({
  providedIn: 'root'
})
export class AuthServiceComponent  {
  registeredUsers:rUser[] = [DEMO_ACCOUNT];
  authMessage = new Subject<authMessage>();
  private isLoggedIn:boolean = false;
  private email: string = '';

  constructor(private router:Router) {
    const localUsers = this.read('rUser');
    if(localUsers){
      try {
        this.registeredUsers = JSON.parse(localUsers);
      } catch {
        // ignore corrupted storage
      }
    }
    if (!this.registeredUsers.some((u) => u.email === DEMO_ACCOUNT.email)) {
      this.registeredUsers.unshift(DEMO_ACCOUNT);
    }
    this.isLoggedIn = this.read('isLoggedIn') === 'true';
    this.email = this.read('currentUser') || '';
  }

  getState():boolean{
    return this.isLoggedIn;
  }

  get currentEmail(): string {
    return this.email;
  }

  login(email:string,password:string){
    email = (email || '').trim().toLowerCase();
    const item = this.registeredUsers.find((x)=> x.email.toLowerCase() === email)
    if(!item){
      this.authMessage.next({
        message:'No account found with that email.',
        type: 'error'
      });
      return;
    }
    if(item.password!==password){
      this.authMessage.next({
        message:'Wrong password. Please try again.',
        type: 'error'
      });
      return
    }
    this.isLoggedIn = true;
    this.email = item.email;
    this.write('isLoggedIn','true');
    this.write('currentUser', item.email);
    this.authMessage.next({ message: '', type: '' })    // clear authMessage
    this.router.navigate(['/']);
  }

  loginDemo(){
    this.login(DEMO_ACCOUNT.email, DEMO_ACCOUNT.password);
  }

  logout(){
    this.isLoggedIn = false;
    this.email = '';
    this.write('isLoggedIn','false');
    this.write('currentUser', '');
    this.router.navigate(['/auth']);
  }

  /** Returns true when the account was created. */
  signUp(email:string,password:string): boolean{
    email = (email || '').trim().toLowerCase();
    const item = this.registeredUsers.find((x)=> x.email.toLowerCase() === email);
    if(item){
      this.authMessage.next({
        message:'An account with this email already exists. Sign in instead.',
        type: 'error'
      });
      return false;
    }
    this.registeredUsers.push({email, password})
    this.write('rUser',JSON.stringify(this.registeredUsers))
    this.authMessage.next({
      message:'Account created! You can sign in now.',
      type: 'success'
    });
    return true;
  }

  private read(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private write(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // storage blocked: session-only login
    }
  }

}
