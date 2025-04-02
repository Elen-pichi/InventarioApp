// src/main/ipc/ipcMovimientos.js
const { ipcMain, BrowserWindow } = require('electron');
const MovimientosControlador = require('../../controladores/MovimientosControlador');

function registrarIPCMovimientos() {

    // Obtener todos los movimientos
    ipcMain.handle('obtener-todos-movimientos', async () => {
        try {
            return await MovimientosControlador.obtenerTodosMovimientos();
        } catch (error) {
            console.error("Error en ipcMovimientos.obtener-todos-movimientos:", error.message);
            throw error;
        }
    });

    // Crear un nuevo movimiento
    ipcMain.handle('crear-movimiento', async (_event, datos) => {
        try {
            const resultado = await MovimientosControlador.crearMovimiento(
                datos.id_producto,
                datos.tipo,
                datos.cantidad
            );
            // Emitimos evento global por si se quiere actualizar algo en la interfaz
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('movimientos-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcMovimientos.crear-movimiento:", error.message);
            throw error;
        }
    });

    // Eliminar un movimiento
    ipcMain.handle('eliminar-movimiento', async (_event, id) => {
        try {
            const resultado = await MovimientosControlador.eliminarMovimiento(id);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('movimientos-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcMovimientos.eliminar-movimiento:", error.message);
            throw error;
        }
    });

}

module.exports = registrarIPCMovimientos;
