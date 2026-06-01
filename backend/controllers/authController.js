import { obtenerUsuarioPorEmail } from '../services/userService.js';
import { generarToken } from '../helpers/jwtHelper.js';
import bcrypt from 'bcryptjs';

/**
 * Maneja el inicio de sesión de los usuarios
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Validación preventiva en el backend
    if (!email || !password) {
        return res.status(400).json({
            err: true,
            message: "Por favor, complete todos los campos (email y clave)."
        });
    }

    try {
        // 2. Comprobar si el correo existe en la base de datos
        const usuario = await obtenerUsuarioPorEmail(email);
        if (!usuario) {
            // Consejo de seguridad Senior: Usa un mensaje genérico para no dar pistas a atacantes
            return res.status(401).json({
                err: true,
                message: "El correo electrónico es incorrecto."
            });
        }

        // 3. Comparar la contraseña en texto plano con el hash encriptado de la BD
        const esClaveCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esClaveCorrecta) {
            return res.status(401).json({
                err: true,
                message: "La contraseña es incorrecto."
            });
        }

        // 4. Si las credenciales son válidas, preparamos la información del token
        const payload = {
            id: usuario.id,
            email: usuario.email
        };

        // 5. Fabricamos el token
        const token = generarToken(payload);

        // 6. Respondemos con éxito enviando el token al Frontend
        return res.json({
            success: true,
            message: "¡Bienvenido al sistema administrativo!",
            token: token,
            user: {
                id: usuario.id,
                email: usuario.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            err: true,
            message: "Error interno en el servidor al procesar el inicio de sesión."
        });
    }
};