import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { ROLE } from '../../models/role.model';
import { Auth } from '../../service/auth/auth';

export const userGuard: CanActivateFn = (route, state) => {
  const AuhtService = inject(Auth);
  const router = inject(Router);

  return AuhtService.getRole$().pipe(
    take(1),
    map((role) => {
      if (role === ROLE.unknown) {
        return router.parseUrl('/shop/home');
      }
      if (role === ROLE.usuario) {
        return true;
      }
      return router.parseUrl('/');
    })
  );
};
