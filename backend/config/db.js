import mssql from 'mssql';
import dotenv from 'dotenv';

/*
Paso 4: Configurar la conexión a la Base de Datos (config/db.js)
Crea una carpeta dentro de backend llamada config y dentro crea el archivo db.js. Este archivo establece el puente de comunicación con SQL Server usando la librería mssql.
*/
// Leemos las credenciales del archivo secreto .env
dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Requerido para conexiones en la nube o seguras
        trustServerCertificate: true // Crucial para que te permita conectar en localhost sin errores de certificado
    }
};

// Creamos un "Pool" (estanque) de conexiones. Es la forma más óptima porque
// reutiliza conexiones abiertas en lugar de crear una nueva en cada clic del usuario.
export const poolPromise = new mssql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('✅ Conexión exitosa con SQL Server establecida.');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error crítico al conectar con SQL Server:', err.message);
        process.exit(1); // Detiene el servidor por completo si no hay base de datos
    });