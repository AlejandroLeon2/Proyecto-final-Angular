import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../../service/auth/auth';
import { toObservable  } from '@angular/core/rxjs-interop';
import { map, take,filter } from 'rxjs';

export const sessionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);

  return toObservable(authService.user).pipe(
    filter(user => user !== null), 
    take(1),                       
    map(user => {
      return user ? true : router.parseUrl('/shop/home');
    })
  );
};
