// services/usuarios.service.js
const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // 👈 Tu archivo de conexión real a la Base de Datos

const usuariosService = {};

// 🟢 1. Lógica para obtener todos los usuarios
usuariosService.getAll = async () => {
  const query = 'SELECT id, nombre, email, rol, estado FROM usuarios';
  const resultado = await pool.query(query);
  return resultado.rows || resultado; // Adapta a (.rows) para pg o (.recordset) para mssql
};

// 🟢 2. Lógica para obtener por ID
usuariosService.getById = async (id) => {
  const query = 'SELECT id, nombre, email, rol, estado FROM usuarios WHERE id = $1';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0] || resultado[0];
};

// 🟢 3. Lógica para crear (con Encriptación)
usuariosService.create = async (userData) => {
  const { nombre, email, rol, password } = userData;

  // Encriptamos la contraseña de manera segura
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = 'INSERT INTO usuarios (nombre, email, rol, password) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol';
  const resultado = await pool.query(query, [nombre, email, rol, hashedPassword]);
  return resultado.rows[0] || resultado[0];
};

// 🟢 4. Lógica para actualizar
usuariosService.update = async (id, userData) => {
  const { nombre, email, rol, password } = userData;

  let query = 'UPDATE usuarios SET nombre = $1, email = $2, rol = $3';
  let params = [nombre, email, rol, id];

  // Si mandó una nueva contraseña desde Angular, la encriptamos y la agregamos al query
  if (password && password.trim() !== '') {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    query += ', password = $4 WHERE id = $5';
    params = [nombre, email, rol, hashedPassword, id];
  } else {
    query += ' WHERE id = $4';
  }

  await pool.query(query, params);
  return { id, nombre, email, rol };
};

// 🟢 5. Lógica para eliminar
usuariosService.delete = async (id) => {
  const query = 'DELETE FROM usuarios WHERE id = $1';
  await pool.query(query, [id]);
  return true;
};

module.exports = usuariosService;