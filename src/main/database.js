const sqlite3 = require('sqlite3').verbose();  // Importa SQLite
const fs = require('fs');  // Permite leer archivos como schema.sql
const path = require('path');  // Maneja rutas sin importar el sistema operativo
const { DB_PATH, SCHEMA_PATH } = require('../main/rutas');  // Ruta de la base de datos

let db;  // Variable para la conexión con SQLite

// Conectar a la base de datos SQLite
try {
    db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
            console.error('Error al conectar con la base de datos:', err.message);
            throw err;  // Detiene la ejecución si hay un error
        } else {
            console.log('Conectado a la base de datos SQLite.');
            inicializarBaseDeDatos();  // Asegura que las tablas existen
        }
    });
} catch (error) {
    console.error("Error general en la configuración de la base de datos:", error.message);
}

// Función para ejecutar schema.sql y crear la base de datos si es necesario
function inicializarBaseDeDatos() {
    const schemaSQL = fs.readFileSync(SCHEMA_PATH, 'utf8');  // Leemos su contenido

    db.exec(schemaSQL, (err) => {
        if (err) {
            console.error("Error al inicializar la base de datos:", err.message);
        } else {
            console.log("Base de datos inicializada correctamente.");
        }
    });
}

// Exportar la conexión para que otros archivos la usen
module.exports = db;


