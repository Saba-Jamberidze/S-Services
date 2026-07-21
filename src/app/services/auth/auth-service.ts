import { Injectable, signal } from '@angular/core';
import { API_BASE } from '../../api-config';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

export interface CurrentUser {
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiBase = `${API_BASE}/api/auth`;
  private readonly tokenKey = 'auth_token';

  currentUser = signal<CurrentUser | null>(null);

  constructor(private http: HttpClient) {}

  login(): void {
    const returnUrl = encodeURIComponent(document.baseURI);
    window.location.href = `${this.apiBase}/login?returnUrl=${returnUrl}`;
  }

  // Backend Google-ის შემდეგ აბრუნებს user-ს URL-ზე ასეთი ფორმით: .../#token=xxxxx
  // ეს მეთოდი აპლიკაციის ჩატვირთვისას (app.config.ts-ის APP_INITIALIZER-იდან) გამოიძახება,
  // რომ ტოკენი "დაიჭიროს" და შეინახოს, სანამ Guard-ი/სხვა ლოგიკა გაეშვება.
  handleAuthCallback(): void {
    const hash = window.location.hash; // მაგ. "#token=xxxxx"
    const match = hash.match(/token=([^&]+)/);

    if (match) {
      const token = decodeURIComponent(match[1]);
      this.setToken(token);

      // ტოკენის ამოშლა address bar-იდან, რომ იქ არ "ეკიდოს"
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  me(): Observable<CurrentUser | null> {
    return this.http.get<CurrentUser>(`${this.apiBase}/me`).pipe(
      tap((user) => this.currentUser.set(user)),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      })
    );
  }

  // JWT stateless არის - "logout" უბრალოდ ტოკენის ლოკალურად წაშლაა,
  // server-თან დამატებითი კომუნიკაცია საჭირო აღარ არის.
  logout(): void {
    this.clearToken();
    this.currentUser.set(null);
  }
}
