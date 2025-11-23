import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../service/auth/auth';

export const userGuard: CanActivateFn = async (route, state) => {
  const AuhtService = inject(Auth);
  const router = inject(Router);

  const token = AuhtService.getToken();

  const rol = await AuhtService.guardUserRol(token);

  if (rol === 'usuario') {
    return true;
  }

  // Si no es usuario, redirige al home
  return router.parseUrl('/');
};
