// fichero IPC específico para la entidad Proveedores.

const { ipcMain, BrowserWindow } = require('electron');
const ProveedoresControlador = require('../../controladores/ProveedoresControlador');
// PENDIENTES LAS VALIDACIONES 

function registrarIPCProveedores() {

    //obtener todos los proveedores existentes en la base de datos
    ipcMain.handle('obtener-todos-proveedores', async () => {
        try {
            return await ProveedoresControlador.obtenerTodosProveedores();
        } catch (error) {
            console.error("Error en ipcProveedores.obtener-todos-proveedores: ", error.message);
            throw error;
        }
    });

    //crear o añadir un nuevo proveedor
    ipcMain.handle('crear-proveedor', async (_event, datos) => {
        try {
            const resultado = await ProveedoresControlador.crearProveedor(
                datos.nombre,
                datos.direccion,
                datos.email,
                datos.telefono,
                datos.contacto
            );
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('proveedor-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.crear-proveedor: ", error.message);
            throw error;
        }
    });

    // recuperar los datos de un proveedor según su id para actualizar
    ipcMain.handle('obtener-proveedor-por-id', async (_event, id) => {
        try {
            return await ProveedoresControlador.obtenerProveedorPorId(id);
        } catch (error) {
            console.error("Error en ipcHandlers.obtener-proveedor-por-id: ", error.message);
            throw error;
        }
    });
    // editar un proveedor cuyo id ha sido obtenido previamente
    ipcMain.handle('editar-proveedor', async (_event, datos) => {
        try {
            const resultado = await ProveedoresControlador.editarProveedor(
                datos.id,
                datos.nombre,
                datos.direccion,
                datos.email,
                datos.telefono,
                datos.contacto
            );
            console.log("Evento proveedor-updated emitido tras edición")
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('proveedor-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.editar-proveedor: ", error.message);
            throw error;
        }
    });

    // eliminar un proveedor
    ipcMain.handle('eliminar-proveedor', async (_event, id) => {
        try {
            const resultado = await ProveedoresControlador.eliminarProveedor(id);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('proveedor-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error al eliminar un proveedor en ipcProveedores: ", error.message);
            throw error;
        }
    });
}

module.exports = registrarIPCProveedores;