import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input()message:string = ''
  @Input()type:string = ''
  /** false = floating toast at the top of the screen */
  @Input()fullParentWidth:boolean = true;
  @Output('onClearMsg') onClearMsg:EventEmitter<void> = new EventEmitter<void>();

  clearMessage(){
    this.onClearMsg.emit()
  }

}
