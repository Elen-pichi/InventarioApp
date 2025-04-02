const db = require('../main/database');

class Ubicacion {
    constructor(id, pasillo, estante, zona) {
        this.id = id;
        this.pasillo = pasillo;
        this.estante = estante;
        this.zona = zona;
    }

    // Obtener pasillos únicos
    static async obtenerPasillos() {
        return new Promise((resolve, reject) => {
            db.all("SELECT DISTINCT pasillo FROM ubicaciones", [], (err, filas) => {
                if (err) {
                    console.error('Error al obtener pasillos:', err);
                    reject(err);
                } else {
                    resolve(filas);
                }
            });
        });
    }

    // Obtener estantes en función del pasillo seleccionado
    static async obtenerEstantes(pasillo) {
        return new Promise((resolve, reject) => {
            db.all("SELECT DISTINCT estante FROM ubicaciones WHERE pasillo = ?", [pasillo], (err, filas) => {
                if (err) {
                    console.error('Error al obtener estantes:', err);
                    reject(err);
                } else {
                    resolve(filas);
                }
            });
        });
    }

    // Obtener zonas en función del pasillo y estante seleccionado
    static async obtenerZonas(pasillo, estante) {
        return new Promise((resolve, reject) => {
            db.all("SELECT DISTINCT zona FROM ubicaciones WHERE pasillo = ? AND estante = ?", [pasillo, estante], (err, filas) => {
                if (err) {
                    console.error('Error al obtener zonas:', err);
                    reject(err);
                } else {
                    resolve(filas);
                }
            });
        });
    }

    // Obtener todas las ubicaciones
    static obtenerTodasUbicaciones() {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM ubicaciones ORDER BY pasillo, estante, zona`;
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // Crear una nueva categoría
    static crearUbicacion(pasillo, estante, zona) {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO ubicaciones (pasillo, estante, zona) VALUES (? , ?, ?)`;
            db.run(query, [pasillo, estante, zona], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, pasillo, estante, zona });
            });
        });
    }

    //no necesitamos recuperar los datos de una categoría por id porque ya están cargados en la misma ventana, no abrimos una nueva ventana para editarlo
    static editarUbicacion(id, pasillo, estante, zona) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE ubicaciones SET pasillo = ?, estante = ?, zona = ? WHERE id = ?`;
            db.run(query, [pasillo, estante, zona, id], function (err) {
                if (err) reject(err);
                else resolve({ id, pasillo, estante, zona });
            });
        });
    }

    // Eliminar una categoría
    static eliminarUbicación(id) {
        return new Promise((resolve, reject) => {
            const query = `DELETE FROM ubicaciones WHERE id = ?`;
            db.run(query, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    // obtener solo aquellas ubicaciones que se encuentran libres para seleccionar
    static obtenerUbicacionesDisponibles() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.*
                FROM ubicaciones u
                LEFT JOIN producto_ubicacion pu ON u.id = pu.id_ubicacion
                WHERE pu.id_producto IS NULL
                ORDER BY u.pasillo, u.estante, u.zona
            `;

            db.all(query, [], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }

    // obtener ubicaciones disponibles + las del producto actual
    static obtenerUbicacionesDisponiblesYAsignadas(idProducto) {
        return new Promise((resolve, reject) => {
            const query = `
            SELECT u.*
            FROM ubicaciones u
            LEFT JOIN producto_ubicacion pu ON u.id = pu.id_ubicacion
            WHERE pu.id_producto IS NULL OR pu.id_producto = ?
            ORDER BY u.pasillo, u.estante, u.zona
        `;
            db.all(query, [idProducto], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }

}

module.exports = Ubicacion;
