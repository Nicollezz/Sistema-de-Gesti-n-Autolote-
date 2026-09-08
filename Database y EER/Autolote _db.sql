CREATE DATABASE IF NOT EXISTS autolote_db ;
USE autolote_db;

-- 1. Gestión de Usuarios 
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Gestión de Vehículos 
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    estado_disponibilidad ENUM('disponible', 'vendido', 'reservado') DEFAULT 'disponible',
    image_url TEXT, -- URL o almacenamiento en la nube para la imagen
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Gestión de Clientes 
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Historial de Consultas de Clientes 
CREATE TABLE consultas_clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    vehiculo_id INT NOT NULL,
    mensaje TEXT NOT NULL,                         
    estado ENUM('pendiente', 'atendido') DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- 5. Gestión de Ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vehiculo_id INT NOT NULL,
    cliente_id INT NOT NULL,
    vendedor_id INT NOT NULL,                       
    precio_total DECIMAL(10, 2) NOT NULL,           
    impuestos_aplicados DECIMAL(10, 2) NOT NULL,    
    
   
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE RESTRICT,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT,
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);