import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthServiceComponent, authMessage, DEMO_ACCOUNT } from './auth-service.service';

describe('AuthServiceComponent', () => {
  let router: jasmine.SpyObj<Router>;

  const fresh = () => {
    TestBed.resetTestingModule();
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: router }] });
    const service = TestBed.inject(AuthServiceComponent);
    const messages: authMessage[] = [];
    service.authMessage.subscribe((m) => messages.push(m));
    return { service, messages };
  };

  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  it('always offers the demo account', () => {
    localStorage.setItem('rUser', JSON.stringify([{ email: 'someone@example.com', password: 'x' }]));
    const { service } = fresh();
    service.loginDemo();
    expect(service.getState()).toBeTrue();
    expect(service.currentEmail).toBe(DEMO_ACCOUNT.email);
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('explains why a sign-in failed', () => {
    const { service, messages } = fresh();
    service.login('missing@example.com', 'x');
    service.login(DEMO_ACCOUNT.email, 'wrong');
    expect(messages.map((m) => m.message)).toEqual(['No account found with that email.', 'Wrong password. Please try again.']);
    expect(service.getState()).toBeFalse();
  });

  it('signs up once per email, case-insensitively', () => {
    const { service } = fresh();
    expect(service.signUp('New@Example.com', 'secret1')).toBeTrue();
    expect(service.signUp('new@example.com', 'secret2')).toBeFalse();

    service.login('NEW@example.com', 'secret1');
    expect(service.getState()).toBeTrue();
  });

  it('remembers the session across reloads and logs out', () => {
    fresh().service.loginDemo();
    const { service } = fresh();
    expect(service.getState()).toBeTrue();
    service.logout();
    expect(fresh().service.getState()).toBeFalse();
  });
});
