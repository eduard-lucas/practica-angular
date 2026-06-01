import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
// Importamos el controlador que acabamos de crear
import { login } from './controllers/authController.js';
import { getLineas, postLinea, putLinea, deleteLinea ,getLinea} from './controllers/lineaNegocioController.js';
// 🟢 1. IMPORTAR LAS NUEVAS RUTAS DE USUARIOS
import usuariosRoutes from './routes/usuarios.routes.js';
//import bcrypt from 'bcryptjs';
// Importación del Middleware Guardián de Seguridad
import { verificarToken } from './middlewares/authMiddleware.js';


// Inicializamos el lector de variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3500;

// --- MIDDLEWARES GLOBALES (Capas de Seguridad y Procesamiento) ---

// 1. Helmet: Blindaje básico. Configura cabeceras HTTP seguras para mitigar ataques comunes de hackers.
app.use(helmet());

// 2. CORS: Permiso de cruce de origen. Permite que tu Angular (localhost:4200) consuma datos de esta API sin ser bloqueado.
app.use(cors({
    origin: 'http://localhost:4200', // Únicamente permitimos el acceso a nuestro Front de Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Morgan: Auditor de consola. Te mostrará en tiempo real qué peticiones entran al servidor (ej: "GET /api/lineas 200").
app.use(morgan('dev'));

// 4. Express JSON: Traductor automático. Permite que Express entienda cuando el frontend le mande un objeto JSON (req.body).
app.use(express.json());


// --- RUTA INICIAL DE PRUEBA ---
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: "¡Servidor Base funcionando perfectamente!" 
    });
});
/*const hashInmediato = await bcrypt.hash('admin123', 10);
console.log("🟢 COPIA ESTE HASH EN TU BD ->", hashInmediato);
*/
app.post('/api/auth/login', login);
app.get('/api/lineas', getLineas); // El catálogo puede verse de forma libre

// --- ENDPOINTS PROTEGIDOS (Requieren Token JWT) ---
// Inyectamos 'verificarToken' justo antes del controlador. Si no lleva token válido, rebota automáticamente.
app.get('/api/linea/:id', verificarToken, getLinea);
app.post('/api/lineas', verificarToken, postLinea);
app.put('/api/lineas/:id', verificarToken, putLinea);
app.delete('/api/lineas/:id', verificarToken, deleteLinea);
// 🟢 2. REGISTRAR LA RUTA DE USUARIOS
app.use('/api/usuarios', verificarToken,usuariosRoutes);

// --- MANEJADOR DE RUTAS NO ENCONTRADAS (Error 404) ---
// Si alguien intenta entrar a un enlace que no existe, cae aquí automáticamente de forma controlada.
app.use((req, res) => {
    res.status(404).json({
        err: true,
        message: "El recurso o endpoint que estás buscando no existe en este servidor."
    });
});

// --- ENCENDER EL MOTOR ---
app.listen(port, () => {
    console.log(`🚀 Servidor backend levantado con éxito.`);
    console.log(`🔗 URL local activa: http://localhost:${port}`);
});

export default app;
/*
http://localhost:3500/api/auth/login
http://localhost:3500/api/linea/1
{
  "email": "admin@correo.com",
  "password": "admin123"
}
  http://localhost:3500/api/lineas
*/