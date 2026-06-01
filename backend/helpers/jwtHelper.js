import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Jalamos la firma secreta desde el archivo .env
const SECRET = process.env.JWT_SECRET;

/**
 * Genera un Token JWT firmado y seguro
 * @param {Object} payload - Datos del usuario que queremos meter dentro del token (id, email)
 */
export const generarToken = (payload) => {
    // Firmamos el token con nuestra palabra secreta y le damos un tiempo de vida de 2 horas
    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
};


//========================================================
/*
🚀 Siguiente Paso: Fase 2 - La Autenticación en el Backend (Login + JWT)
Ya que confirmaste que todo quedó en orden, vamos a construir el motor de seguridad de tu backend. Crearemos los archivos encargados de verificar contraseñas, generar la "pulsera VIP" (Token JWT) y el guardián que protegerá tus futuros CRUDs.

Sigue este orden exacto para crear los archivos en las carpetas correspondientes de tu backend/:

Paso 1: Crear el Helper de JWT (helpers/jwtHelper.js)
Crea este archivo. Su única función en la vida es fabricar las pulseras digitales 
(Tokens) con una duración de 2 horas.

Paso 2: Crear el Guardián del Backend (middlewares/authMiddleware.js)
Crea la carpeta middlewares dentro de backend y añade este archivo. 
Este código interceptará las peticiones a las zonas de administración y 
revisará si el usuario tiene permiso.

Paso 3: Crear el Servicio de Usuario (services/userService.js)
Crea la carpeta services y añade este archivo. Se encarga de hacer 
la consulta limpia a SQL Server buscando si existe el email que intenta loguearse.

Paso 4: Crear el Controlador de Autenticación (controllers/authController.js)
Crea este archivo dentro de controllers. Aquí recibimos el correo 
y clave que el usuario escribirá en el formulario de Angular, 
comparamos con la base de datos y le entregamos su token.
*/