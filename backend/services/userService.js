import { poolPromise } from '../config/db.js';
import mssql from 'mssql';

/**
 * Busca un usuario en la base de datos mediante su correo electrónico
 */
export const obtenerUsuarioPorEmail = async (email) => {
    try {
        const pool = await poolPromise;
        
        // Usamos parámetros (.input) para sanitizar la consulta. 
        // Esto evita hackeos por 'Inyección SQL', indispensable en pruebas técnicas.
        const result = await pool.request()
            .input('emailParam', mssql.VarChar, email)
            .query('SELECT * FROM Usuarios WHERE email = @emailParam');
        
        // Si encontró al usuario devuelve sus datos, si no, devuelve null
        return result.recordset[0] || null;
    } catch (error) {
        console.error("Error en userService -> obtenerUsuarioPorEmail:", error.message);
        throw error;
    }
};