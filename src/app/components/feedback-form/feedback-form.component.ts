import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
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
  /** ISO timestamp; missing on feedback saved by older versions */
  date?: string;
}


@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit, OnDestroy {
  @ViewChild(NgForm) feedbackForm:NgForm = {} as NgForm;
  @Input() name:string = ''
  @Input() onHideModal:Subject<void> = new Subject<void>();
  @Output() onFeedback = new EventEmitter<feedback>();

  hideSub:Subscription = new Subscription();

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
                          {name: 'Undecided', id: 'und'},
                          {name: 'Not at all', id: 'not'}
                        ];

  services:format[] = [
                        {name:'Ecommerce service',id:'ES'},
                        {name:'Delivery Service',id:'DS'},
                        {name:'Supply Chain Service',id:'SS'}
                      ];

  ngOnInit(): void {
    this.hideSub = this.onHideModal.subscribe(()=>{
      this.clearForm()
    })
  }

  onSubmit(){
    if (this.feedbackForm.invalid) return;
    const value = this.feedbackForm.value;
    this.onFeedback.emit({
      name: this.name,
      ...value,
      social: value.social || [],
      reason: (value.reason || '').trim(),
      date: new Date().toISOString(),
    })
    this.clearForm();
  }

  clearForm(){
    this.followedSocials = [];
    this.feedbackForm.resetForm?.()
  }

  ngOnDestroy(){
    this.hideSub.unsubscribe()
  }
}
