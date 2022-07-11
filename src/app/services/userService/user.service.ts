import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { feedback } from 'src/app/components/feedback-form/feedback-form.component';
import { dummyUsers } from './dummyUsers';

export interface fUser{
  name:string;
  avatar:string;
  email:string;
  phone:string;
  id:string;
  location:{
    city:string;
    country:string;
  };
  feedback: feedback | null
}


@Injectable({
  providedIn: 'root'
})
export class UserService { 
  users:fUser[] = [];
  onDetailClicked:Subject<fUser>= new Subject<fUser>();
  onCreateUser:Subject<fUser>= new Subject<fUser>();
  onFeedbackSuccess: Subject<string> = new Subject<string>() ;



  constructor() { 
    const localUsers:string | null = localStorage.getItem('fUser');
    if(localUsers){
      this.users = JSON.parse(localUsers);
    }else{
      this.users = dummyUsers;
    }
    
  }

  addFeedback(id:string,feedback:feedback):void{
    this.users.map((x)=> x.id===id? x.feedback = feedback :x);
    localStorage.setItem('fUser',JSON.stringify(this.users))
    this.onFeedbackSuccess.next('Feedback Submitted successfully!');
  }

  getUsers(){
    return this.users.slice();
  }

  createUser(user:fUser){
      this.users.push(user);
      this.onCreateUser.next(user)
      localStorage.setItem('fUser',JSON.stringify(this.users))
  }

  generateFakeID():string{
    return `${this.helperFakeID()}-${this.helperFakeID()}-${this.helperFakeID()}}`
  }
  helperFakeID():string{
    return (Math.random() + 1).toString(36).substring(7);
  }
}
