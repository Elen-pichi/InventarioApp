// src/modelos/UsuariosModelo.js
const db = require('../main/database');
const bcrypt = require('bcryptjs');

class Usuario {
  // crear usuario
  static async crear({ nombre, usuario, contraseña, rol }) {
    const hash = await bcrypt.hash(contraseña, 10);
    const query = `INSERT INTO usuarios (nombre, usuario, contraseña, rol) VALUES (?, ?, ?, ?)`;
    return new Promise((resolve, reject) => {
      db.run(query, [nombre, usuario, hash, rol], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, nombre, usuario, rol });
      });
    });
  }

  // obtener por usuario para verificar credenciales (búsqueda por usuario)
  static obtenerPorUsuario(usuario) {
    const query = `SELECT * FROM usuarios WHERE usuario = ?`;
    return new Promise((resolve, reject) => {
      db.get(query, [usuario], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // verificar credenciales
  static async verificarCredenciales(usuario, contrasenaIngresada) {
    const usuarioDB = await this.obtenerPorUsuario(usuario);
    if (!usuarioDB) return null;

    const valido = await bcrypt.compare(contrasenaIngresada, usuarioDB.contraseña);
    return valido
      ? { id: usuarioDB.id, nombre: usuarioDB.nombre, rol: usuarioDB.rol }
      : null;
  }

  // obtener todos los usuarios
  static obtenerTodos() {
    const query = `SELECT id, nombre, usuario, rol FROM usuarios ORDER BY nombre`;
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // obtener usuario por id
  static async obtenerPorId(id) {
    const query = `SELECT id, nombre, usuario, rol FROM usuarios WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }


  // editar usuario
  static async editar({ id, nombre, usuario, rol, contraseña }) {
    if (contraseña) {
      const hash = await bcrypt.hash(contraseña, 10);
      const query = `UPDATE usuarios SET nombre = ?, usuario = ?, rol = ?, contraseña = ? WHERE id = ?`;
      return new Promise((resolve, reject) => {
        db.run(query, [nombre, usuario, rol, hash, id], function (err) {
          if (err) reject(err);
          else resolve();
        });
      });
    } else {
      const query = `UPDATE usuarios SET nombre = ?, usuario = ?, rol = ? WHERE id = ?`;
      return new Promise((resolve, reject) => {
        db.run(query, [nombre, usuario, rol, id], function (err) {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  }

  // eliminar usuario
  static eliminar(id) {
    const query = `DELETE FROM usuarios WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [id], function (err) {
        if (err) reject(err);
        else resolve({ cambios: this.changes });
      });
    });
  }


  // cambiar contraseña
  static async cambiarContrasena(id, nuevaContrasena) {
    const hash = await bcrypt.hash(nuevaContrasena, 10);
    const query = `UPDATE usuarios SET contraseña = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.run(query, [hash, id], function (err) {
        if (err) reject(err);
        else resolve({ cambios: this.changes });
      });
    });
  }
}

module.exports = Usuario;
