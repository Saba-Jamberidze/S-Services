import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogoutClick() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });
  }
}