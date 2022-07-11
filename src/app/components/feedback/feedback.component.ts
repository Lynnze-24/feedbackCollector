import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/userService/user.service';
import { feedback } from '../feedback-form/feedback-form.component';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  @Input() feedback:feedback | null = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }



}
