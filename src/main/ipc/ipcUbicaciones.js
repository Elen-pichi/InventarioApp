const { ipcMain, BrowserWindow } = require('electron');
const UbicacionesControlador = require('../../controladores/UbicacionesControlador');

// función general llamada desde ipcHandlers.js
function registrarIPCUbicaciones() {

    //obtener todas las ubicaciones existentes en la base de datos
    ipcMain.handle('obtener-todas-ubicaciones', async () => {
        try {
            return await UbicacionesControlador.obtenerTodasUbicaciones();
        } catch (error) {
            console.error("Error en ipcubicaciones.obtener-todas-ubicaciones: ", error.message);
            throw error;
        }
    });

    //crear o añadir una nueva ubicacion
    ipcMain.handle('crear-ubicacion', async (_event, datos) => {
        try {
            const resultado = await UbicacionesControlador.crearUbicacion(datos.pasillo, datos.estante, datos.zona);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('ubicaciones-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.crear-ubicacion: ", error.message);
            throw error;
        }
    });


    // editar una ubicacion, no hace falta recuperar por id porque ya están los datos cargados en la misma ventana
    ipcMain.handle('editar-ubicacion', async (_event, datos) => {
        try {
            const resultado = await UbicacionesControlador.editarUbicacion(datos.id,
                datos.pasillo, datos.estante, datos.zona);
            console.log("Evento ubicacion-updated emitido tras edición")
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('ubicaciones-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.editar-ubicacion: ", error.message);
            throw error;
        }
    });

    // eliminar un ubicacion
    ipcMain.handle('eliminar-ubicacion', async (_event, id) => {
        try {
            const resultado = await UbicacionesControlador.eliminarUbicacion(id);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('ubicaciones-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error al eliminar un ubicacion en ipcubicaciones: ", error.message);
            throw error;
        }
    });

       // obtener pasillos únicos
       ipcMain.handle('obtener-pasillos', async () => {
        try {
            return await UbicacionesControlador.obtenerPasillos();
        } catch (error) {
            console.error("Error en ipcUbicaciones.obtener-pasillos:", error.message);
            throw error;
        }
    });

    // obtener estantes según pasillo
    ipcMain.handle('obtener-estantes', async (_event, pasillo) => {
        try {
            return await UbicacionesControlador.obtenerEstantes(pasillo);
        } catch (error) {
            console.error("Error en ipcUbicaciones.obtener-estantes:", error.message);
            throw error;
        }
    });

    // obtener zonas según pasillo y estante
    ipcMain.handle('obtener-zonas', async (_event, { pasillo, estante }) => {
        try {
            return await UbicacionesControlador.obtenerZonas(pasillo, estante);
        } catch (error) {
            console.error("Error en ipcUbicaciones.obtener-zonas:", error.message);
            throw error;
        }
    });

    // obtener las ubicaciones disponibles
    ipcMain.handle('obtener-ubicaciones-disponibles', async () => {
       try {
        return await UbicacionesControlador.obtenerUbicacionesDisponibles();
       } catch (error) {
        console.error("Error en ipcUbicaciones.obtener-ubicaciones-disponibles: ", error.message);
        throw error;
       } 
    });

    ipcMain.handle('obtener-ubicaciones-disponibles-y-asignadas', async (_event, idProducto) => {
        try {
            return await UbicacionesControlador.obtenerUbicacionesDisponiblesYAsignadas(idProducto);
        } catch (error) {
            console.error("Error en obtener-ubicaciones-disponibles-y-asignadas:", error.message);
            throw error;
        }
    });
    
}

module.exports = registrarIPCUbicaciones;