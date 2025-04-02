/* archivo IPC específico para la entidad Productos. 
Se encarga de gestionar las solicitudes CRUD de los producto desde la interfaz y los manda al controlador. Además maneja posibles errores que el controlador no haya podido detectar*/

const { ipcMain, BrowserWindow } = require('electron');
const ProductosControlador = require('../../controladores/ProductosControlador');
const { validarProducto, validarId } = require('../../js/validaciones');

// función general llamada desde IpcHandlers.js
function registrarIPCProductos() {
    // obtener todos los productos del almacén
    ipcMain.handle('obtener-todos-productos', async () => {
        try {
            return await ProductosControlador.obtenerTodosProductos();
        } catch (error) {
            console.error("Error en ipcHandlers.obtener-todos-productos: ", error.message);
            throw error;
        }
    });

    // cuando se indica _event es que no se está usando el parámetro dentro de la función, si usamos evento, indicamos que si se usa el parámetro dentro de la función. 
    //ejemplo lo usaremos cuando hay que responder con un mensaje evento.reply("respuesta-creacion: ", resultado)
    //agregar nuevo producto al almacén
    ipcMain.handle('crear-producto', async (_event, datos) => {
        try {

            console.log("⚡ Datos recibidos en ipcMain ipcProductos.js:", datos); // 👈 NUEVO LOG
            //validar antes de enviar los datos al controlador
            const error = validarProducto(datos);
            if (error) {
                console.log("⛔ Producto inválido:", error);
                return { error };
            }

            // aseguramos que ubicaciones sea un array (por si acaso)
            const ubicaciones = Array.isArray(datos.ubicaciones) ? datos.ubicaciones : [];

            const resultado = await ProductosControlador.crearProducto(
                datos.codigo,
                datos.producto,
                datos.stock,
                parseInt(datos.categoria),
                parseFloat(datos.precio),
                ubicaciones, // ahora claramente un array
                parseInt(datos.proveedor)
            );

            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('producto-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.crear-producto: ", error.message);
            throw error;
        }
    });

    // recuperar un producto según su id
    ipcMain.handle('obtener-producto-por-id', async (_event, id) => {
        try {
            const error = validarId(id);
            if (error) return { error };
            return await ProductosControlador.obtenerProductoPorId(id);
        } catch (error) {
            console.error("Error en ipcHandlers.obtener-producto-por-id: ", error.message);
            throw error;
        }
    });

    // obtener todas las ubicaciones asignadas a un producto (tabla intermedia)
    ipcMain.handle('obtener-ubicaciones-por-producto', async (_event, id) => {
        try {
            return await ProductosControlador.obtenerUbicacionesPorProducto(id);
        } catch (error) {
            console.error("Error en ipcProductos.obtener-ubicaciones-por-producto:", error.message);
            throw error;
        }
    });


    //actualizar un producto existente en el almacén
    ipcMain.handle('editar-producto', async (_event, datos) => {
        try {
            const error = validarProducto(datos);
            if (error) return { error };

            const ubicaciones = Array.isArray(datos.ubicaciones) ? datos.ubicaciones : [];

            const resultado = await ProductosControlador.editarProducto(
                datos.id,
                datos.codigo,
                datos.producto,
                datos.stock,
                datos.categoria,
                datos.precio,
                datos.ubicaciones, // array de ubicaciones nuevas
                datos.proveedor
            );

            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('producto-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.editar-producto: ", error.message);
            throw error;
        }
    });

    //eliminar un producto del almacen
    ipcMain.handle('eliminar-producto', async (_event, id) => {
        try {
            const error = validarId(id);
            if (error) return { error };

            const resultado = await ProductosControlador.eliminarProducto(id);

            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('producto-updated');
            });
            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.eliminar-producto: ", error.message);
            throw error;
        }
    });

    // aumentar el stock de un producto existente
    ipcMain.handle('aumentar-stock', async (_event, { id, cantidad }) => {
        try {
            const error = validarId(id);
            if (error) return { error };

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                return { error: 'La cantidad debe ser un número entero positivo.' };
            }

            const resultado = await ProductosControlador.aumentarStock(id, cantidad);

            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('producto-updated');
            });

            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.aumentar-stock: ", error.message);
            throw error;
        }
    });

    // disminuir el stock de un producto existente
    ipcMain.handle('disminuir-stock', async (_event, { id, cantidad }) => {
        try {
            const error = validarId(id);
            if (error) return { error };

            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                return { error: 'La cantidad debe ser un número entero positivo.' };
            }

            const resultado = await ProductosControlador.disminuirStock(id, cantidad);

            BrowserWindow.getAllWindows().forEach(win => {
                win.webContents.send('producto-updated');
            });

            return resultado;
        } catch (error) {
            console.error("Error en ipcHandlers.disminuir-stock: ", error.message);
            throw error;
        }
    });

    // buscar producto por código
    ipcMain.handle('buscar-producto-por-codigo', async (_event, codigo) => {
        try {
            return await ProductosControlador.buscarPorCodigo(codigo);
        } catch (error) {
            console.error("Error en buscar-producto-por-codigo:", error.message);
            throw error;
        }
    });

    // buscar producto por nombre
    ipcMain.handle('buscar-producto-por-nombre', async (_event, nombre) => {
        try {
            return await ProductosControlador.buscarPorNombre(nombre);
        } catch (error) {
            console.error("Error en buscar-producto-por-nombre:", error.message);
            throw error;
        }
    });
}

module.exports = registrarIPCProductos;