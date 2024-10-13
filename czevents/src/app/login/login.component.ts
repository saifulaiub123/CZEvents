import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private _baseUrl: string = environment.apiUrl;

  @Input() showSlider: boolean = false;

  isLoginActive: boolean = true;
  isRegistering: boolean = false;

  onLoginClick(): void {
    this.isLoginActive = true;
  }

  onRegistrationClick(): void {
    this.isLoginActive = false;
  }

  loginData: any = {
    email: '',
    password: ''
  };

  user: any = {
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  // Function to handle user registration
  registerUser() {
    if (this.user.password !== this.user.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const registrationUrl = `${this._baseUrl}/User/Register-User`;

    // Disable the sign-up button to prevent multiple clicks
    this.isRegistering = true;

    this.http.post<any>(registrationUrl, {
      username: this.user.username,
      email: this.user.email,
      mobileNumber: this.user.mobileNumber,
      password: this.user.password
    })
    .subscribe(
      (response) => {
        alert('User registered successfully!');

        // Store the token and redirect
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/Profile']);

        // Reset form and enable the button again
        this.resetForm();
        this.isRegistering = false;
      },
      (error) => {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');

        // Enable the button after an error
        this.isRegistering = false;
      }
    );
  }



  // Function to handle user login
  loginUser() {
    const loginUrl = `${this._baseUrl}/User/Login-User`;

    this.http.post(loginUrl, {
      email: this.loginData.emailOrPhone,
      password: this.loginData.password
    }).subscribe(
      (response: any) => {

        // Store the token in localStorage
        localStorage.setItem('authToken', response.token);

        // Redirect to the profile or another page after login
        this.router.navigate(['/Profile']);
      },
      (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }

  // Function to reset the login form
  resetLoginForm() {
    this.loginData = {
      emailOrPhone: '',
      password: ''
    };
  }
  // Function to reset the form fields
  resetForm() {
    this.user = {
      username: '',
      email: '',
      mobileNumber: '',
      password: '',
      confirmPassword: ''
    };
  }

}
