// controllers/usuarios.controller.js
//const usuariosService = require('../services/usuarios.service'); // 👈 Inyectamos el servicio
import usuariosService from '../services/usuarios.service.js';

const usuariosController = {};

// GET ALL
usuariosController.getUsuarios = async (req, res) => {
  try {
    const data = await usuariosService.getAll();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error en controlador getUsuarios:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// GET BY ID
usuariosController.getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await usuariosService.getById(id);
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error en controlador getUsuarioById:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// POST (CREATE)
usuariosController.createUsuario = async (req, res) => {
  try {
    //console.log(res.body);
    const data = await usuariosService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error en controlador createUsuario:', error);
    res.status(500).json({ success: false, message: 'Error al registrar usuario' });
  }
};

// PUT (UPDATE)
usuariosController.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await usuariosService.update(id, req.body);
    res.json({ success: true, message: 'Usuario actualizado', data });
  } catch (error) {
    console.error('Error en controlador updateUsuario:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar usuario' });
  }
};

// DELETE
usuariosController.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await usuariosService.delete(id);
    res.json({ success: true, message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en controlador deleteUsuario:', error);
    res.status(500).json({ success: false, message: 'Error al eliminar usuario' });
  }
};

//module.exports = usuariosController;
export default usuariosController;
