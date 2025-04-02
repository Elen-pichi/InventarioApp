const db = require('../main/database');

class Movimiento {
  constructor(id, id_producto, tipo, cantidad, fecha) {
    this.id = id;
    this.id_producto = id_producto;
    this.tipo = tipo;
    this.cantidad = cantidad;
    this.fecha = fecha;
  }

  // obtener todos los movimientos ordenados por fecha descendente
  static obtenerTodosMovimientos() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT movimientos.id, productos.producto AS nombre_producto, tipo, cantidad, fecha
        FROM movimientos
        JOIN productos ON movimientos.id_producto = productos.id
        ORDER BY fecha DESC
      `;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // crear un nuevo movimiento
  static crearMovimiento(id_producto, tipo, cantidad) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO movimientos (id_producto, tipo, cantidad)
        VALUES (?, ?, ?)
      `;
      db.run(query, [id_producto, tipo, cantidad], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, id_producto, tipo, cantidad });
      });
    });
  }

  // eliminar un movimiento
  static eliminarMovimiento(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM movimientos WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

module.exports = Movimiento;

