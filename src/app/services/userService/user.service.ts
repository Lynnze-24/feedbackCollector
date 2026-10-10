import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { feedback } from 'src/app/components/feedback-form/feedback-form.component';
import { dummyUsers } from './dummyUsers';

export interface fUser{
  name:string;
  avatar:string;
  email:string;
  phone:string;
  id:string;
  location:{
    city:string;
    country:string;
  };
  feedback: feedback | null
}

const STORAGE_KEY = 'fUser';

// Older versions of the demo shipped real contact details in the sample data;
// swap them out of anything saved in a visitor's browser.
const OLD_SAMPLE_EMAIL = 'aunghtetlinn.yit@gmail.com';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<fUser[]>(this.load());
  users$ = this.usersSubject.asObservable();

  onDetailClicked: Subject<fUser> = new Subject<fUser>();
  onDeleteClicked: Subject<fUser> = new Subject<fUser>();

  get users(): fUser[] {
    return this.usersSubject.value;
  }

  getUsers(): fUser[] {
    return this.users.slice();
  }

  getUser(id: string): fUser | undefined {
    return this.users.find((x) => x.id === id);
  }

  addFeedback(id: string, fb: feedback): void {
    this.save(this.users.map((x) => (x.id === id ? { ...x, feedback: fb } : x)));
  }

  createUser(user: fUser): void {
    this.save([user, ...this.users]);
  }

  deleteUser(id: string): void {
    this.save(this.users.filter((x) => x.id !== id));
  }

  resetDemo(): void {
    this.save(JSON.parse(JSON.stringify(dummyUsers)));
  }

  generateFakeID(): string {
    return `${this.helperFakeID()}-${this.helperFakeID()}-${this.helperFakeID()}`;
  }

  helperFakeID(): string {
    return (Math.random() + 1).toString(36).substring(7);
  }

  private load(): fUser[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const users: fUser[] = JSON.parse(saved);
        return users.map((u) =>
          u.email === OLD_SAMPLE_EMAIL ? { ...u, email: 'brian.james@example.com', phone: '+12025550143' } : u
        );
      }
    } catch {
      // corrupted storage: fall back to the demo data
    }
    return JSON.parse(JSON.stringify(dummyUsers));
  }

  private save(users: fUser[]): void {
    this.usersSubject.next(users);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // storage full or blocked: keep working in memory
    }
  }
}
