import { AuthStorage } from "../../../core/models/header";
import { UserData } from "../../../core/models/header";
import { Response } from "../../../core/models/header";

// Obtener datos del usuario desde localStorage
export function getUserDataLocal(): Response<UserData> {
  // Leer clave 'auth'
  const localData = localStorage.getItem('auth');

  // Si no existe, devolver resultado indicando que no hay sesión
  if (!localData) {
    return { result: 'no-auth' };
  }

  // Convertir a objeto
  const storage: AuthStorage = JSON.parse(localData);
  
  // Retornar solo los datos necesarios
  return {
    photo: storage.photoURL,
    rol: storage.rol
  };
}

// Eliminar datos del usuario en localStorage
export function deleteUserData(): void {
  localStorage.removeItem('auth');
}
