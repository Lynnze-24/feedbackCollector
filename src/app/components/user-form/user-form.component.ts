import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { fUser, UserService } from 'src/app/services/userService/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit,OnDestroy {
  @ViewChild(NgForm) userForm:NgForm = {} as NgForm;
  @Input() onHideModal:Subject<void> = new Subject<void>();
  @Output() created = new EventEmitter<fUser>();
  hideSub: Subscription = new Subscription();
  duplicateEmail = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.hideSub = this.onHideModal.subscribe(()=>{
      this.clearForm();
    })
  }

  onSubmit(){
    if (this.userForm.invalid) return;
    const value = this.userForm.value;
    const email = value.email.trim().toLowerCase();
    if (this.userService.users.some((u) => u.email.toLowerCase() === email)) {
      this.duplicateEmail = true;
      return;
    }
    const newUser: fUser = {
      name: value.name.trim(),
      email,
      phone: `+${value.phone}`,
      avatar: (value.avatar || '').trim(),
      location: {
        city: (value.location?.city || '').trim(),
        country: (value.location?.country || '').trim(),
      },
      id: this.userService.generateFakeID(),
      feedback: null,
    };
    this.userService.createUser(newUser);
    this.created.emit(newUser);
    this.clearForm()
  }

  clearForm(){
    this.duplicateEmail = false;
    this.userForm.resetForm?.()
  }

  ngOnDestroy(){
    this.hideSub.unsubscribe()
  }

}
