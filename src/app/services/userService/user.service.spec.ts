import { TestBed } from '@angular/core/testing';
import { dummyUsers } from './dummyUsers';
import { UserService } from './user.service';

describe('UserService', () => {
  const fresh = () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(UserService);
  };

  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  it('starts with the demo customers', () => {
    expect(fresh().users.length).toBe(dummyUsers.length);
  });

  it('saves feedback without mutating the previous list', () => {
    const service = fresh();
    const before = service.users;
    const target = before.find((u) => !u.feedback)!;

    service.addFeedback(target.id, {
      name: target.name, rating: 4, reason: 'Nice', satisfactory: 'OK', services: 'Delivery Service', social: [],
    });

    expect(before.find((u) => u.id === target.id)!.feedback).toBeNull();
    expect(service.getUser(target.id)!.feedback!.rating).toBe(4);
    expect(JSON.parse(localStorage.getItem('fUser')!).find((u: { id: string }) => u.id === target.id).feedback.rating).toBe(4);
  });

  it('adds new customers to the top and deletes by id', () => {
    const service = fresh();
    const user = { ...dummyUsers[1], id: 'new-1', email: 'new@example.com', feedback: null };
    service.createUser(user);
    expect(service.users[0].id).toBe('new-1');

    service.deleteUser('new-1');
    expect(service.getUser('new-1')).toBeUndefined();
  });

  it('resets to the demo data', () => {
    const service = fresh();
    service.deleteUser(service.users[0].id);
    service.resetDemo();
    expect(service.users.length).toBe(dummyUsers.length);
  });

  it('replaces the real contact details older versions stored', () => {
    localStorage.setItem('fUser', JSON.stringify([{ ...dummyUsers[0], email: 'aunghtetlinn.yit@gmail.com', phone: '+9593338429' }]));
    const user = fresh().users[0];
    expect(user.email).toBe('brian.james@example.com');
    expect(user.phone).not.toBe('+9593338429');
  });

  it('falls back to demo data when storage is corrupted', () => {
    localStorage.setItem('fUser', '{not json');
    expect(fresh().users.length).toBe(dummyUsers.length);
  });

  it('generates ids without stray characters', () => {
    expect(fresh().generateFakeID()).toMatch(/^[a-z0-9]+-[a-z0-9]+-[a-z0-9]+$/);
  });
});
