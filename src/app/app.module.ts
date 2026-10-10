import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRouterModule } from './router/app-router-moudule';
import {InputTextModule} from 'primeng/inputtext';
import { MessageComponent } from './components/message/message.component';
import { AuthPageComponent } from './screens/auth-page/auth-page.component';
import { MainPageComponent } from './screens/main-page/main-page.component';
import { AgGridModule } from 'ag-grid-angular';
import { GridBtnComponent } from './components/grid-btn/grid-btn.component';
import {DialogModule} from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RadioButtonModule} from 'primeng/radiobutton';
import { FeedbackFormComponent } from './components/feedback-form/feedback-form.component';
import {CheckboxModule} from 'primeng/checkbox';
import {DropdownModule} from 'primeng/dropdown';
import {RatingModule} from 'primeng/rating';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { InsightsComponent } from './components/insights/insights.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { CustomerCellComponent } from './components/customer-cell/customer-cell.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    MainPageComponent,
    MessageComponent,
    GridBtnComponent,
    FeedbackFormComponent,
    FeedbackComponent,
    UserFormComponent,
    InsightsComponent,
    AvatarComponent,
    CustomerCellComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRouterModule,
    FormsModule,
    InputTextModule,
    AgGridModule,
    DialogModule,
    RadioButtonModule,
    CheckboxModule,
    DropdownModule,
    RatingModule,
    ConfirmDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
