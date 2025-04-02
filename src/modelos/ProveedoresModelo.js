const db = require('../main/database');

class Proveedor {
    constructor(id, nombre, direccion, email, telefono, contacto) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.email = email;
        this.telefono = telefono;
        this.contacto = contacto;
    }

    // obtener todos los proveedores existentes en la base de datos
    static obtenerTodosProveedores() {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM proveedores`, [], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }

    // crear un nuevo proveedor
    static crearProveedor(nombre, direccion, email, telefono, contacto) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO proveedores (nombre, direccion, email, telefono, contacto) VALUES (?, ?, ?, ?, ?)`,
                [nombre, direccion, email, telefono, contacto],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, nombre, direccion, email, telefono, contacto });
                }
            )
        });
    }

    // editar un proveedor existente: obtenerProveedorPorId y editarProveedor
    static obtenerProveedorPorId(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM proveedores WHERE id = ?`;
            db.get(query, [id], (err, fila) => {
                if (err) reject(err);
                else resolve(fila);
            });
        });
    }

    static editarProveedor(id, nombre, direccion, email, telefono, contacto) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE proveedores SET nombre = ?, direccion = ?, email = ?, telefono = ?, contacto = ? WHERE id =?`,
                [nombre, direccion, email, telefono, contacto, id],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id, nombre, direccion, email, telefono, contacto });
                }
            );
        });
    }

    static eliminarProveedor(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM proveedores WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

}

module.exports = Proveedor;