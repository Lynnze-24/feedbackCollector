import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input()message:string = ''
  @Input()type:string = ''
  @Input()fullParentWidth:boolean = true;
  @Output('onClearMsg') onClearMsg:EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  clearMessage(){
    this.onClearMsg.emit()
  }

}
