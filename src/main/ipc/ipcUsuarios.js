const { ipcMain, BrowserWindow } = require('electron');
const UsuariosControlador = require('../../controladores/UsuariosControlador');

function registrarIPCUsuarios() {

  // función recoge el login y al usuario en una variable global para mantener la sesión abierta
  ipcMain.handle('login', async (event, { usuario, contraseña }) => {
    try {
      const datos = await UsuariosControlador.login(usuario, contraseña);

      // guardar sesión en memoria
      global.usuarioActual = datos;

      return datos;
    } catch (error) {
      console.error("Error al guardar al usuario actual ", error.massage);
      throw error;
    }
  });

  // obtener usuario actual
  ipcMain.handle('obtener-usuario-actual', async () => {
    const id = global.usuarioActual?.id;
    if (!id) return null;
    return await UsuariosControlador.obtenerUsuarioActual(id);
  });

  // obtener todos los usuarios
  ipcMain.handle('obtener-todos-usuarios', async () => {
    try {
      return await UsuariosControlador.obtenerTodos();
    } catch (error) {
      console.error("Error al recuperar los datos de los usuarios: ", error.massage);
      throw error;
    }
  });

  // crear usuario
  ipcMain.handle('crear-usuario', async (_event, datos) => {
    try {
      const nuevo = await UsuariosControlador.crearUsuario(datos);
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('usuarios-updated');
      });
      return nuevo;
    } catch (error) {
      console.error('Error al crear usuario:', error.message);
      throw error;
    }
  });

  // editar usuario
  ipcMain.handle('editar-usuario', async (_event, datos) => {
    try {
      await UsuariosControlador.editarUsuario(datos);
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('usuarios-updated');
      });
    } catch (error) {
      console.error('Error al editar usuario:', error.message);
      throw error;
    }
  });


  // eliminar usuarios
  ipcMain.handle('eliminar-usuario', async (_event, id) => {
    try {
      await UsuariosControlador.eliminarUsuario(id);
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('usuarios-updated');
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error.message);
      throw error;
    }
  });

  // cambiar contraseña
  ipcMain.handle('cambiar-contraseña', async (_event, { id, nuevaContraseña }) => {
    try {
      await UsuariosControlador.cambiarContraseña(id, nuevaContraseña);
      BrowserWindow.getAllWindows().forEach(win => {
        win.webContents.send('usuarios-updated');
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error.message);
      throw error;
    }
  });

  //logout que borre los datos de sesión
  ipcMain.handle('logout', async () => {
    global.usuarioActual = null;

    // cerrar todas las ventanas
    BrowserWindow.getAllWindows().forEach(win => win.close());

    return true;
  });

}

module.exports = registrarIPCUsuarios;