import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  // Method to set user data
  setUser(user: any) {
    this.userSubject.next(user);
  }

  // Method to clear user data
  clearUser() {
    this.userSubject.next(null);
  }
}
