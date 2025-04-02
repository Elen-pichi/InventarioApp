const bcrypt = require('bcryptjs');
const db = require('./src/main/database'); // o la ruta donde instancies SQLite

async function insertarUsuariosIniciales() {
  const usuarios = [
    { nombre: 'Administrador', usuario: 'admin', contraseña: 'admin123', rol: 'admin' },
    { nombre: 'Operador', usuario: 'usuario', contraseña: 'usuario123', rol: 'usuario' }
  ];

  for (const u of usuarios) {
    const hash = await bcrypt.hash(u.contraseña, 10);
    db.run(
      `INSERT INTO usuarios (nombre, usuario, contraseña, rol) VALUES (?, ?, ?, ?)`,
      [u.nombre, u.usuario, hash, u.rol],
      (err) => {
        if (err) {
          console.error(`❌ Error al insertar usuario ${u.usuario}:`, err.message);
        } else {
          console.log(`✅ Usuario ${u.usuario} insertado correctamente`);
        }
      }
    );
  }
}

insertarUsuariosIniciales();


