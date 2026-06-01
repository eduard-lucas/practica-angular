// src/routes/usuarios.routes.js
import { Router } from 'express';
import usuariosController from '../controllers/usuarios.controller.js'; // 👈 Recuerda el .js al final

const router = Router();

// Mapeo de rutas hacia el controlador
router.get('/', usuariosController.getUsuarios);
router.get('/:id', usuariosController.getUsuarioById);
router.post('/', usuariosController.createUsuario);
router.put('/:id', usuariosController.updateUsuario);
router.delete('/:id', usuariosController.deleteUsuario);

export default router; // 👈 Exportación moderna