import { poolPromise } from '../config/db.js';
import mssql from 'mssql';

/**
 * Obtener todas las líneas de negocio (Para el catálogo público del Front)
 */
export const listarLineas = async (terminoBusqueda = '') => {
    try {
        let query = 'SELECT * FROM LineasNegocio';//'SELECT * FROM LineasNegocio ORDER BY id DESC'
        const pool = await poolPromise;
        const request = await pool.request();
        if(terminoBusqueda){
            request.input("buscarParam", mssql.VarChar, `%${terminoBusqueda}%`);
            query += ' where nombre like @buscarParam';
        }
        const result = await request.query(query);//const result = await pool.request().query('SELECT * FROM LineasNegocio ORDER BY id DESC');
        //console.log("➡️ SQL Server devolvió:", result.recordset);
        return result.recordset;
    } catch (error) {
        console.error("Error en lineaNegocioService -> listarLineas:", error.message);
        throw error;
    }
};
export const getLinea = async (id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().input("idParam", mssql.Int,id)
        .query('SELECT * FROM LineasNegocio where Id = @idParam');
        return result.recordset;
    } catch (error) {
        console.error("Error en lineaNegocioService -> listarLineas:", error.message);
        throw error;
    }
};
/**
 * Crear una nueva línea de negocio
 */
export const crearLinea = async (lineaNegocio) => {
    try {
        let {nombre, descripcion ='valor automatico'} = lineaNegocio;
        const pool = await poolPromise;
        await pool.request()
            .input('nombreParam', mssql.VarChar, nombre)
            .input('descParam', mssql.VarChar, descripcion)
            .query('INSERT INTO LineasNegocio (nombre, descripcion) VALUES (@nombreParam, @descParam)');
        return true;
    } catch (error) {
        console.error("Error en lineaNegocioService -> crearLinea:", error.message);
        throw error;
    }
};

/**
 * Actualizar una línea de negocio existente
 */
export const actualizarLinea = async (lineaNegocio) => {
    try {
        let {id, nombre, descripcion} = lineaNegocio;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idParam', mssql.Int, id)
            .input('nombreParam', mssql.VarChar, nombre)
            .input('descParam', mssql.VarChar, descripcion)
            .query('UPDATE LineasNegocio SET nombre = @nombreParam, descripcion = @descParam WHERE id = @idParam');
        
        return result.rowsAffected[0] > 0; // Devuelve true si modificó un registro
    } catch (error) {
        console.error("Error en lineaNegocioService -> actualizarLinea:", error.message);
        throw error;
    }
};

/**
 * Eliminar una línea de negocio de la base de datos
 */
export const eliminarLinea = async (id) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idParam', mssql.Int, id)
            .query('DELETE FROM LineasNegocio WHERE id = @idParam');
        
        return result.rowsAffected[0] > 0; // Devuelve true si eliminó un registro
    } catch (error) {
        console.error("Error en lineaNegocioService -> eliminarLinea:", error.message);
        throw error;
    }
};