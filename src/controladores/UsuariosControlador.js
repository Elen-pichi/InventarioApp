const Usuario = require('../modelos/UsuariosModelo');

class UsuariosControlador {
  static async login(usuario, contraseña) {
    try {
      const datos = await Usuario.verificarCredenciales(usuario, contraseña);
      if (!datos) {
        console.error('Credenciales inválidas');
      }
      return datos; // { id, nombre, rol }
    } catch (error) {
      console.error("Error al iniciar Sesión: ", error.massage);
      throw error;
    }
  }

  // obtener el usuario que tiene abierta la sesión.
  static async obtenerUsuarioActual(id) {
    try {
      const usuario = await Usuario.obtenerPorId(id);
      if (!usuario) {
        console.error('Usuario no encontrado');
      }
      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario actual: ', error.massage);
      throw error;
    }
  }


  // obtener todos los usuarios
  static async obtenerTodos() {
    try {
      const usuarios = await Usuario.obtenerTodos();
      return usuarios;
    } catch (error) {
      console.error('Error al obtener usuarios: ', error.message);
    }
  }


  // crear usuario
  static async crearUsuario(datos) {
    try {
      const { nombre, usuario, contraseña, rol } = datos;
      if (!nombre || !usuario || !contraseña || !rol) {
        console.error('Todos los campos son obligatorios');
        return;
      }
      return await Usuario.crear(datos);
    } catch (error) {
      console.error('Error al crear usuario: ', error.message);
      throw error;
    }
  }


  // editar usuario
  static async editarUsuario(datos) {
    try {
      if (!datos.id || !datos.nombre || !datos.usuario || !datos.rol) {
        console.error('Faltan campos obligatorios');
        return;
      }
      return await Usuario.editar(datos);
    } catch (error) {
      console.error('Error al editar usuario: ', error.message);
      throw error;
    }
  }

  static async eliminarUsuario(id) {
    try {
      if (!id) {
        console.error('ID no válido');
        return;
      }
      return await Usuario.eliminar(id);
    } catch (error) {
      console.error('Error al eliminar usuario: ', error.message);
      throw error;
    }
  }

  // cambiar contraseña
  static async cambiarContraseña(id, nuevaContraseña) {
    try {
      if (!id || !nuevaContraseña) {
        console.error('Datos inválidos');
        return;
      }
      return await Usuario.cambiarContraseña(id, nuevaContraseña);
    } catch (error) {
      console.error('Error al cambiar la contraseña: ', error.message);
    }
  }

}

module.exports = UsuariosControlador;
