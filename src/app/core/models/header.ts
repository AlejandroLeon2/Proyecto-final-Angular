// Datos almacenados en localStorage después del login
export interface AuthStorage {
  rol: string;        // Rol del usuario (ej: "admin", "usuario")
  photoURL: string;   // URL de la foto del perfil
}

// Datos que devuelve la función al procesar AuthStorage
export interface UserData {
  photo: string;      // Imagen de perfil ya filtrada o procesada
  rol: string;        // Rol asignado al usuario
}

// Tipo de respuesta genérico: puede devolver un resultado o un tipo de datos
export type Response<T> = { result: string } | T;
