import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';


interface format{
  name:string,
  id:string;
}

export interface feedback{
  name:string;
  rating: number;
  reason: string;
  satisfactory:string;
  services:string;
  social:string[];
}


@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit {
  @ViewChild(NgForm) feedbackForm:NgForm = {} as NgForm;
  @Input() name:string = ''
  @Input() onHideModal:Subject<void> = {} as Subject<void>;
  @Output() onFeedback = new EventEmitter<feedback>();

  hideSub:Subscription = {} as Subscription;

  followedSocials:string[]= [];
  
  socials:format[] = [
                      {name:'twitter',id:'twt'},
                      {name:'linkedIn',id:'lkn'},
                      {name:'facebook',id:'fb'},
                      {name:'instagram',id:'insta'}
                    ]
  
  satisStats: format[] = [
                          {name: 'Delighted', id: 'dl'}, 
                          {name: 'OK', id: 'ok'},
                          {name: 'Not at all', id: 'not'},
                          {name: 'Undecided', id: 'und'}
                        ];

  services:format[] = [
                        {name:'Ecommerce service',id:'ES'},
                        {name:'Delivery Service',id:'DS'},
                        {name:'Supply Chain Service',id:'SS'}
                      ];
  


  constructor() {
    
   }

  ngOnInit(): void {
    this.hideSub = this.onHideModal.subscribe(()=>{
      this.clearForm()
    })
  }

  onSubmit(){
    this.onFeedback.emit({name:this.name,...this.feedbackForm.value})
    this.clearForm();
  }

  clearForm(){
    this.feedbackForm.resetForm()
  }
}
