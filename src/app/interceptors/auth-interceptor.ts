import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth-service';
import { API_BASE } from '../api-config';

// ეს interceptor ავტომატურად ურთავს "Authorization: Bearer <token>" header-ს
// ყველა request-ს, რომელიც ჩვენს Backend-ს ეხება - ხელით აღარ გჭირდებათ
// ამის გახსენება ყოველ HTTP call-ზე.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // მხოლოდ ჩვენი Backend-ისკენ მიმავალ request-ებს ვეხებით
  if (!req.url.startsWith(API_BASE)) {
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
