-- fichero que contiene las tablas de la base de datos

-- crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK(rol IN ('admin', 'usuario'))
);


-- crear tabla ubicaciones si no existe
CREATE TABLE IF NOT EXISTS ubicaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pasillo VARCHAR(10) NOT NULL,
    estante VARCHAR(10) NOT NULL,
    zona VARCHAR(10) NOT NULL,
    UNIQUE(pasillo, estante, zona)
    
);

-- crear tabla categorias si no existe
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- crear tabla proveedores si no existe
CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    telefono VARCHAR(20),
    contacto VARCHAR(255)    
);

-- crear tabla productos si no existe
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo VARCHAR(100) UNIQUE,
    producto VARCHAR(255) NOT NULL,
    stock INTEGER NOT NULL CHECK (stock >= 0),
    id_categoria INTEGER NOT NULL,
    precio NUMERIC(10,2) NOT NULL CHECK (precio >=0),
    id_proveedor INTEGER,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id) ON DELETE SET NULL
);

-- crear tabla movimientos si no existe
CREATE TABLE IF NOT EXISTS movimientos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_producto INTEGER NOT NULL,
  tipo TEXT NOT NULL, -- 'entrada' o 'salida'
  cantidad INTEGER NOT NULL,
  fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- crear tabla intermedia productos-ubicaciones para obtener más de una ubicación por producto
CREATE TABLE IF NOT EXISTS producto_ubicacion (
    id_producto INTEGER NOT NULL,
    id_ubicacion INTEGER NOT NULL,
    PRIMARY KEY (id_producto, id_ubicacion),
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_ubicacion) REFERENCES ubicaciones(id) ON DELETE CASCADE
);



/*-- Inserción de datos iniciales en ubicaciones (Opcional)
INSERT INTO ubicaciones (pasillo, estante, zona) VALUES 
('A', '1', 'X'), ('A', '1', 'Y'), ('A', '2', 'X'),
('B', '1', 'X'), ('B', '2', 'Y'), ('C', '3', 'Z')
ON CONFLICT DO NOTHING;

-- Inserción de datos iniciales en categorías (Opcional)
INSERT INTO categorias (nombre) VALUES 
('Electrónica'), ('Muebles'), ('Alimentos')
ON CONFLICT DO NOTHING;

-- Inserción de datos iniciales en ubicaciones (Opcional)
INSERT INTO proveedores (nombre, direccion, email, telefono, contacto) VALUES
('dfdf', 'dadf','dffd','dadfd','cdfadfon'),
('lkklk', 'kljlk','ljkl','jlkl','kjlkl')
ON CONFLICT DO NOTHING;

INSERT INTO productos(codigo, producto, stock, id_categoria, precio, id_proveedor) VALUES ("122333", "lámpara", 45, 1, 82, 1),
("456", "lámpara", 45, 1, 82, 2)
ON CONFLICT DO NOTHING;

INSERT INTO producto_ubicacion(id_producto, id_ubicacion) VALUES (1,2),
(1,3), (1,4), (2,5)
ON CONFLICT DO NOTHING;*/





