import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';


@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private authService: AuthService) {}

  onLoginClick() {
    this.authService.login();
  }
}