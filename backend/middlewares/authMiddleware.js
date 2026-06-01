import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_SECRET;

/**
 * Middleware para bloquear rutas si no se envía un Token válido
 */
export const verificarToken = (req, res, next) => {
    // 1. Extraemos la cabecera 'Authorization' de la petición HTTP
    const authHeader = req.headers['authorization'];
    
    // Si el frontend no mandó ninguna cabecera, lo rebotamos
    if (!authHeader) {
        return res.status(401).json({
            err: true,
            message: "Acceso denegado. Se requiere autenticación para esta acción."
        });
    }

    // 2. El formato estándar es: "Bearer ENORME_CADENA_DEL_TOKEN"
    // Separamos el texto por el espacio para quedarnos solo con la cadena del token
    const token = authHeader.split(' ')[1];
    console.log('token',token);
    if (!token) {
        return res.status(401).json({
            err: true,
            message: "Formato de autenticación inválido."
        });
    }

    try {
        console.log('genera exception');
        // 3. Verificamos si el token fue alterado o ya caducó
        const decoded = jwt.verify(token, SECRET);
        console.log('decoded',decoded);
        // 4. Si todo es real, guardamos los datos decodificados dentro de la petición 'req'
        // para que los siguientes métodos sepan qué usuario está operando
        req.usuarioLogueado = decoded;
        
        // 5. ¡Pase adelante! Damos luz verde a la siguiente función o controlador
        next();
    } catch (error) {
        console.log('error', error);
        return res.status(403).json({
            err: true,
            message: "Su sesión ha expirado o el token es inválido2. Inicie sesión nuevamente."
        });
    }
};