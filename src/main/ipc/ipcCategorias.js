const { ipcMain, BrowserWindow } = require('electron');
const CategoriasControlador = require('../../controladores/CategoriasControlador');

// función general llamada desde ipcHandlers.js
function registrarIPCCategorias() {

    //obtener todas las Categorias existentes en la base de datos
    ipcMain.handle('obtener-todas-categorias', async () => {
        try {
            return await CategoriasControlador.obtenerTodasCategorias();
        } catch (error) {
            console.error("Error en ipcCategorias.obtener-todas-categorias: ", error.message);
            throw error;
        }
    });

    //crear o añadir una nueva categoría
    ipcMain.handle('crear-categoria', async (_event, datos) => {
        try {
            const resultado = await CategoriasControlador.crearCategoria(datos.nombre);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('categorias-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.crear-categoria: ", error.message);
            throw error;
        }
    });


    // editar un categoria, no hace falta recuperar por id porque ya están los datos cargados en la misma ventana
    ipcMain.handle('editar-categoria', async (_event, datos) => {
        try {
            const resultado = await CategoriasControlador.editarCategoria(datos.id,
                datos.nombre);
            console.log("Evento categoria-updated emitido tras edición")
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('categorias-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.editar-categoria: ", error.message);
            throw error;
        }
    });

    // eliminar un categoria
    ipcMain.handle('eliminar-categoria', async (_event, id) => {
        try {
            const resultado = await CategoriasControlador.eliminarCategoria(id);
            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('categorias-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error al eliminar un categoria en ipcCategorias: ", error.message);
            throw error;
        }
    });
}

module.exports = registrarIPCCategorias;