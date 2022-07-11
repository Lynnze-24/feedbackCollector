import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthServiceComponent } from '../authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  

  constructor(private authService : AuthServiceComponent,
              private router: Router  ) { }

 
  canActivate(route:ActivatedRouteSnapshot , routerState:RouterStateSnapshot): boolean | UrlTree{
  
      let loginState = this.authService.getState();
      let isValid = this.validateRoute(routerState.url,loginState);
      if(!isValid){
        let newRoute = this.oppositeRoute(routerState.url)
        this.router.navigate([newRoute])
      }
      
      return isValid

  }

  validateRoute(path:string,state:boolean):boolean{
    if(path==='/'){
      return state;
    }
     return !state;
  }

  oppositeRoute(path:string):string{
    if(path==='/'){
      return '/auth';
    }
    return '/'
  }


 


}
