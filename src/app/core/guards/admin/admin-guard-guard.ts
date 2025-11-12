import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth as authservice} from '../../service/auth';


export const adminGuardGuard: CanActivateFn = async(route, state) => {

  const Auth = inject(authservice);
  const router = inject(Router);

  //obtenermos token de ususario
  const token:string = Auth.getUidUser();

  if(!token){
    router.navigate(['/login'])
  }

  const rol = await Auth.getUserRol(token);

  if(rol === 'admin'){
    return true
  }

  router.navigate(['/'])
  return false;
};
