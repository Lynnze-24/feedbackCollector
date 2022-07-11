import { NgModule } from "@angular/core";
import {  RouterModule, Routes } from "@angular/router";
import { AuthPageComponent } from "../screens/auth-page/auth-page.component";
import { MainPageComponent } from "../screens/main-page/main-page.component";
import { AuthGuardService } from "../services/authGuard/auth-guard.service";

const appRoutes: Routes = [
    {path: '',component: MainPageComponent,canActivate:[AuthGuardService]},
    {path: 'auth',component: AuthPageComponent,canActivate:[AuthGuardService]},
    {path: '**',redirectTo:''},
]

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports:[RouterModule]
})


export class AppRouterModule{

}