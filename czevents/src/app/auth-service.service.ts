import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor() { }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('Authentication');
    return !!token; // Return true if token exists, false otherwise
  }
}
