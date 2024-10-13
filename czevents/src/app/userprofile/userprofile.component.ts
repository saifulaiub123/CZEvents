import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { UserserviceService } from '../auth/userservice.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit{
  private _baseUrl: string = environment.apiUrl;

  @Input() showSlider: boolean = false;
  user: any;
  isUpcomingActive: boolean = true;

  constructor(private http: HttpClient, private userService: UserserviceService) { }

  ngOnInit() {
    // Fetch user data when the component is initialized
    this.getUserData();
  }
  onUpcomingClick(): void {
    this.isUpcomingActive = true;
  }

  onPastClick(): void {
    this.isUpcomingActive = false;
  }

  getUserData() {
    const userDataUrl = `${this._baseUrl}/User/GetUserData`;
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No token found. Please login.');
      return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get(userDataUrl, { headers }).subscribe(
      (response: any) => {
        this.user = response;
        this.userService.setUser(response); // Update the shared service
      },
      (error) => {
        console.error('Error retrieving user data:', error);
        alert('Failed to retrieve user data.');
      }
    );
  }
}
