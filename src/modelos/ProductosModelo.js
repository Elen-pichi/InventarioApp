// fichero que maneja la tabla almacén en la base de datos. Los errores producidos los manejará el controlador.

const db = require('../main/database');
const { validarProducto, validarId } = require('../js/validaciones');

class Producto {
    constructor(id, codigo, producto, stock, categoria, precio, proveedor) {
        this.id = id;
        this.codigo = codigo;
        this.producto = producto;
        this.stock = stock;
        this.categoria = categoria;
        this.precio = precio;
        this.proveedor = proveedor;
    }

    // obtener todos los productos con sus ubicaciones combinadas
    static obtenerTodosProductos() {
        return new Promise((resolve, reject) => {
            const query = `
                 SELECT 
                     p.id,
                     p.codigo,
                     p.producto,
                     p.stock,
                     p.precio,
                     c.nombre AS categoria,
                     pr.nombre AS proveedor,
                     GROUP_CONCAT(u.pasillo || '*' || u.estante || '*' || u.zona, ' / ') AS ubicaciones
                 FROM productos p
                 JOIN categorias c ON p.id_categoria = c.id
                 LEFT JOIN proveedores pr ON p.id_proveedor = pr.id
                 LEFT JOIN producto_ubicacion pu ON p.id = pu.id_producto
                 LEFT JOIN ubicaciones u ON pu.id_ubicacion = u.id
                 GROUP BY p.id
             `;
            db.all(query, [], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }


    
    // crear un nuevo producto con múltiples ubicaciones
    static crearProducto(codigo, producto, stock, categoria, precio, ubicaciones, proveedor) {
         return new Promise((resolve, reject) => {
             db.run(
                 `INSERT INTO productos (codigo, producto, stock, id_categoria, precio, id_proveedor) VALUES (?, ?, ?, ?, ?, ?)`,
                 [codigo, producto, stock, categoria, precio, proveedor],
                 function (err) {
                     if (err) return reject(err);
 
                     const idProducto = this.lastID;
                     if (!Array.isArray(ubicaciones) || ubicaciones.length === 0) return resolve({ id: idProducto });
 
                     const stmt = db.prepare(`INSERT INTO producto_ubicacion (id_producto, id_ubicacion) VALUES (?, ?)`);
 
                     
                     ubicaciones.forEach(idUbicacion => {
                         stmt.run(idProducto, idUbicacion);
                     });
                     stmt.finalize();
                     resolve({ id: idProducto, codigo, producto, stock, categoria, precio, ubicaciones, proveedor });                    
                 }
             );
         });
     }

    // obtener un producto por su ID (solo datos básicos)
    static obtenerProductoPorId(id) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM productos WHERE id = ?`;
            db.get(query, [id], (err, fila) => {
                if (err) reject(err);
                else resolve(fila);
            });
        });
    }

    // obtener todas las ubicaciones asociadas a un producto
    static obtenerUbicacionesPorProducto(idProducto) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT u.id, u.pasillo, u.estante, u.zona
                FROM ubicaciones u
                JOIN producto_ubicacion pu ON u.id = pu.id_ubicacion
                WHERE pu.id_producto = ?
            `;
            db.all(query, [idProducto], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }

    // eliminar ubicaciones asociadas a un producto (útil antes de editar)
    static eliminarUbicacionesDeProducto(idProducto) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM producto_ubicacion WHERE id_producto = ?`, [idProducto], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    // editar un producto y actualizar sus ubicaciones
    static editarProducto(id, codigo, producto, stock, categoria, precio, ubicaciones, proveedor) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE productos SET codigo = ?, producto = ?, stock = ?, id_categoria = ?, precio = ?, id_proveedor = ? WHERE id = ?`,
                [codigo, producto, stock, categoria, precio, proveedor, id],
                function (err) {
                    if (err) return reject(err);

                    // limpiar ubicaciones anteriores
                    db.run(`DELETE FROM producto_ubicacion WHERE id_producto = ?`, [id], function (err) {
                        if (err) return reject(err);

                        if (!Array.isArray(ubicaciones) || ubicaciones.length === 0)
                            return resolve({ id, codigo, producto, stock, categoria, precio, ubicaciones, proveedor });

                        const stmt = db.prepare(`INSERT INTO producto_ubicacion (id_producto, id_ubicacion) VALUES (?, ?)`);
                        ubicaciones.forEach(idUbicacion => {
                            stmt.run(id, idUbicacion);
                        });
                        stmt.finalize();

                        resolve({ id, codigo, producto, stock, categoria, precio, ubicaciones, proveedor });
                    });
                }
            );
        });
    }

    // eliminar un producto
    static eliminarProducto(id) {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM productos WHERE id = ?`, [id], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    // aumentar el sctock de un producto
    static aumentarStock(id_producto, cantidad) {
        return new Promise((resolve, reject) => {
            db.run(`UPDATE productos SET stock = stock + ? WHERE id = ?`, [cantidad, id_producto], function (err) {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }


    // disminuir el stock de un producto
    static disminuirStock(id_producto, cantidad) {
        return new Promise((resolve, reject) => {
            const query = `UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?`;
            db.run(query, [cantidad, id_producto, cantidad], function (err) {
                if (err) reject(err);
                else if (this.changes === 0) reject(new Error("Stock insuficiente para realizar la salida"));
                else resolve(true);
            });
        });
    }

    // buscar un producto por código
    static buscarPorCodigo(codigo) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM productos WHERE codigo = ?`, [codigo], (err, fila) => {
                if (err) reject(err);
                else resolve(fila);
            });
        });
    }


    // buscar un producto por nombre
    static buscarPorNombre(nombre) {
        return new Promise((resolve, reject) => {
            const query = `SELECT * FROM productos WHERE producto LIKE ?`;
            db.all(query, [`%${nombre}%`], (err, filas) => {
                if (err) reject(err);
                else resolve(filas);
            });
        });
    }
}

module.exports = Producto;
