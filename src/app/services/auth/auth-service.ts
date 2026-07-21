import { Injectable, signal } from '@angular/core';
import { API_BASE } from '../../api-config';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

export interface CurrentUser{
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBase = `${API_BASE}/api/auth`;

  currentUser = signal<CurrentUser | null>(null)

  constructor(private http:HttpClient) {}

  login(): void {
  const returnUrl = encodeURIComponent(document.baseURI);

  window.location.href =
    `${this.apiBase}/login?returnUrl=${returnUrl}`;
  }

  me(): Observable<CurrentUser | null> {
    return this.http.get<CurrentUser>(`${this.apiBase}/me`, { withCredentials: true }).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    )
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiBase}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.currentUser.set(null))
    );
  }
}
