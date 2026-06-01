// services/usuarios.service.js
import bcrypt from 'bcryptjs';
import { poolPromise } from '../config/db.js'; // Asegúrate de poner el .js al final si usas ES Modules
import mssql from 'mssql';

const usuariosService = {};

// 🟢 1. OBTENER TODOS LOS USUARIOS
usuariosService.getAll = async () => {
  const query = 'SELECT id, email, password FROM Usuarios';
  
  const pool = await poolPromise; // 👈 Esperamos la conexión activa
  const resultado = await pool.request().query(query);
  
  return resultado.recordset; // 👈 En SQL Server se usa .recordset en lugar de .rows
};

// 🟢 2. OBTENER UN USUARIO POR ID
usuariosService.getById = async (id) => {
  const query = 'SELECT id, email, password FROM Usuarios WHERE id = @id';
  
  const pool = await poolPromise;
  const resultado = await pool.request()
    .input('id', mssql.Int, id) // 🔐 Protección contra Inyección SQL
    .query(query);
    
  return resultado.recordset[0]; // Retorna el primer usuario encontrado
};

// 🟢 3. CREAR UN USUARIO
usuariosService.create = async (userData) => {
  const { nombre, email, rol, password } = userData;

  // Encriptamos la contraseña
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // SQL Server usa OUTPUT INSERTED para retornar los datos recién creados
  const query = `
    INSERT INTO Usuarios (email, password) 
    OUTPUT INSERTED.id, INSERTED.email
    VALUES (@email, @password)
  `;

  const pool = await poolPromise;
  const resultado = await pool.request()
    //.input('nombre', mssql.VarChar, nombre)
    .input('email', mssql.VarChar, email)
    //.input('rol', mssql.VarChar, rol)
    .input('password', mssql.VarChar, hashedPassword)
    .query(query);

  return resultado.recordset[0];
};

// 🟢 4. ACTUALIZAR UN USUARIO
usuariosService.update = async (id, userData) => {
  const { nombre, email, rol, password } = userData;

  const pool = await poolPromise;
  // Inicializamos el request para ir inyectando parámetros dinámicamente
  const request = pool.request()
    .input('id', mssql.Int, id)
    //.input('nombre', mssql.VarChar, nombre)
    .input('email', mssql.VarChar, email)
    //.input('rol', mssql.VarChar, rol);

  let query = 'UPDATE Usuarios SET email = @email ';

  // Si el usuario cambió la contraseña en el formulario de Angular
  if (password && password.trim() !== '') {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    request.input('password', mssql.VarChar, hashedPassword);
    query += ', password = @password WHERE id = @id';
  } else {
    query += ' WHERE id = @id';
  }

  await request.query(query);
  return { id, nombre, email, rol };
};

// 🟢 5. ELIMINAR UN USUARIO
usuariosService.delete = async (id) => {
  const query = 'DELETE FROM Usuarios WHERE id = @id';

  const pool = await poolPromise;
  await pool.request()
    .input('id', mssql.Int, id)
    .query(query);

  return true;
};

export default usuariosService;