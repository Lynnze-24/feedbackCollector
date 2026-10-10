import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthServiceComponent } from '../authService/auth-service.service';
import { AuthGuardService } from './auth-guard.service';

describe('AuthGuardService', () => {
  let loggedIn: boolean;
  let router: jasmine.SpyObj<Router>;
  let guard: AuthGuardService;

  const visit = (url: string) => guard.canActivate({} as ActivatedRouteSnapshot, { url } as RouterStateSnapshot);

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthServiceComponent, useValue: { getState: () => loggedIn } },
      ],
    });
    guard = TestBed.inject(AuthGuardService);
  });

  it('sends signed-out visitors to the sign-in page', () => {
    loggedIn = false;
    expect(visit('/')).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('sends signed-in users from the sign-in page to the dashboard', () => {
    loggedIn = true;
    expect(visit('/auth')).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(visit('/')).toBeTrue();
  });
});
