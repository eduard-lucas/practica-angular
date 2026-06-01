// src/app/interfaces/usuario.interface.ts

// 1. Molde exclusivo para el Login (Solo lo necesario)
export interface LoginCredentials {
  email: string;
  password: string;
}

// 2. Molde completo para cuando registras, editas o listas usuarios
export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password?: string; // Opcional aquí si no se quiere mostrar
  activo: boolean;
}