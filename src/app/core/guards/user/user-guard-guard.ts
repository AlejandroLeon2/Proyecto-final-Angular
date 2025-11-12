import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth as authservice} from '../../service/auth';


export const userGuardGuard: CanActivateFn = async(route, state) => {

  const Auth = inject(authservice);
  const router = inject(Router);

  //obtenermos token de ususario
  const token:string = Auth.getUidUser();
  console.log(token);
  if(token =="no-auth" ){
    router.navigate(['/login'])
  }

  const rol = await Auth.getUserRol(token);

  if(rol === 'usuario'){
    return true
  }

  router.navigate(['/user'])
  return false;
};
