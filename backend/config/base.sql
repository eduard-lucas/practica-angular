-- 1. Creamos la base de datos del sistema
CREATE DATABASE SistemaAdminDB;
GO

-- 2. Le decimos a SQL Server que use esta base de datos
USE SistemaAdminDB;
GO

-- 3. Tabla de Usuarios (Para Login y CRUD Administrativo)
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY, -- Se autoincrementa solo (1, 2, 3...)
    email VARCHAR(100) UNIQUE NOT NULL, -- No se pueden repetir correos
    password VARCHAR(255) NOT NULL -- Aquí se guarda la clave ENCRIPTADA
);
GO
update Usuarios set password= '$2b$10$diqNJIbrzccwVaEdbsG9o.PIJUQOnQpqqoJIs3s4HKcZQRJGyF6C.' where email= 'admin@correo.com';
/*
-- 4. Tabla de Líneas de Negocio (Catálogo Público y CRUD)
CREATE TABLE LineasNegocio (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    estado VARCHAR(20) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo')) -- Validación a nivel de BD
);
GO
*/
-- 5. Insertamos un usuario administrador por defecto para que puedas iniciar sesión
-- Nota: La clave aquí guardada es el hash seguro correspondiente a la contraseña 'admin123'
INSERT INTO Usuarios (email, password) 
VALUES ('admin@correo.com', '$2b$10$76YmPbcCgXg4S0m7m6/VreJvW/4DgnfI69rZtyS14g1GvU3E8vMVO');
/*
-- 6. Insertamos un par de líneas de negocio para tener datos en el catálogo público
INSERT INTO LineasNegocio (nombre, estado) VALUES ('Tecnología e Innovación', 'Activo');
INSERT INTO LineasNegocio (nombre, estado) VALUES ('Consultoría Financiera', 'Activo');
*/
--------------------------------------------LineasNegocio

CREATE TABLE LineasNegocio (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    fechaCreacion DATETIME DEFAULT GETDATE()
);

-- Insertemos un par de registros de prueba para el catálogo inicial
INSERT INTO LineasNegocio (nombre, descripcion) VALUES 
('Desarrollo Software', 'Soluciones integrales a la medida en .NET y Node.js'),
('Aseguramiento de Calidad', 'Pruebas automatizadas y control de calidad de software');
GO