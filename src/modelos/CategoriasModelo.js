const db = require('../main/database');

class Categoria {
  constructor(id, nombre) {
    this.id = id;
    this.nombre = nombre;
  }

  // Obtener todas las categorías
  static obtenerTodasCategorias() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM categorias ORDER BY nombre ASC`;
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Crear una nueva categoría
  static crearCategoria(nombre) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO categorias (nombre) VALUES (?)`;
      db.run(query, [nombre], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, nombre });
      });
    });
  }

  //no necesitamos recuperar los datos de una categoría por id porque ya están cargados en la misma ventana, no abrimos una nueva ventana para editarlo

  // Editar una categoría existente
  static editarCategoria(id, nombre) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE categorias SET nombre = ? WHERE id = ?`;
      db.run(query, [nombre, id], function (err) {
        if (err) reject(err);
        else resolve({ id, nombre });
      });
    });
  }

  // Eliminar una categoría
  static eliminarCategoria(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM categorias WHERE id = ?`;
      db.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve(true);
      });
    });
  }
}

module.exports = Categoria;

