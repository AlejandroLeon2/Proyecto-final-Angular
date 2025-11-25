import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../service/auth/auth';

export const userGuard: CanActivateFn = async (route, state) => {
  const AuhtService = inject(Auth);
  const router = inject(Router);

  const role = AuhtService.role();
  if (role === 'unknown') {
    return router.parseUrl('/shop/home');
  }
  if (role === 'usuario') {
    return true;
  }

  // Si no es usuario, redirige al home
  return router.parseUrl('/');
};
