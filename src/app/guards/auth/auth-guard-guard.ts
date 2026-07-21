import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { map } from 'rxjs';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)
  
  return authService.me().pipe(
    map((user) => {
      if(user) {
        return true
      }

      router.navigate(['/login']);
      return false
    })
  )
};
