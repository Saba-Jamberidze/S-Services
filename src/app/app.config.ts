import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';
import { AuthService } from './services/auth/auth-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // აპლიკაციის ჩატვირთვისთანავე, router-ის საწყის ნავიგაციამდე,
    // ვამოწმებთ URL-ში ხომ არ არის ახლახან Google-იდან დაბრუნებული token
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      authService.handleAuthCallback();
    }),
  ],
};
