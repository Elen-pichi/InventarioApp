// preload.js - Intermediario seguro entre el frontend y el backend en Electron.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

    // métodos de los usuarios
    login: (usuario, contraseña) => ipcRenderer.invoke('login', { usuario, contraseña }),
    obtenerUsuarioActual: () => ipcRenderer.invoke('obtener-usuario-actual'),
    obtenerTodosUsuarios: () => ipcRenderer.invoke('obtener-todos-usuarios'),
    crearUsuario: (datos) => ipcRenderer.invoke('crear-usuario', datos),
    editarUsuario: (datos) => ipcRenderer.invoke('editar-usuario', datos),
    eliminarUsuario: (id) => ipcRenderer.invoke('eliminar-usuario', id),
    cambiarContraseña: (id, nuevaContraseña) => ipcRenderer.invoke('cambiar-contraseña', { id, nuevaContraseña }),
    onUsuariosUpdated: (callback) => ipcRenderer.on('usuarios-updated', callback),
    logout: () => ipcRenderer.invoke('logout'),



    // métodos de los productos
    obtenerTodosProductos: () => ipcRenderer.invoke('obtener-todos-productos'),
    // debe devolver un objeto "producto" con un campo "ubicaciones" que es un array de varios id's
    crearProducto: (producto) => ipcRenderer.invoke('crear-producto', producto),
    eliminarProducto: (id) => ipcRenderer.invoke('eliminar-producto', id),
    editarProducto: (producto) => ipcRenderer.invoke('editar-producto', producto),
    // métado para recuperar un producto según su id, otro por código y otro por nombre para realizar búsquedas
    obtenerProductoPorId: (id) => ipcRenderer.invoke('obtener-producto-por-id', id),
    obtenerUbicacionesDeProducto: (id) => ipcRenderer.invoke('obtener-ubicaciones-por-producto', id),
    // recuperar categorías, ubicaciones y proveedores existentes para los desplegables del formulario de creación de un nuevo producto
    buscarProductoPorCodigo: (codigo) => ipcRenderer.invoke('buscar-producto-por-codigo', codigo),
    buscarProductoPorNombre: (nombre) => ipcRenderer.invoke('buscar-producto-por-nombre', nombre),
    aumentarStock: ({ id, cantidad }) => ipcRenderer.invoke('aumentar-stock', { id, cantidad }),
    disminuirStock: ({ id, cantidad }) => ipcRenderer.invoke('disminuir-stock', { id, cantidad }),
    // método que recibe los datos del producto que se va a editar para rellenar el formulario de edición
    onProductoEditar: (callback) => ipcRenderer.on('producto-editar', (_event, producto) => callback(producto)),
    // evento para actualizar el listado de productos
    onProductosUpdated: (callback) => ipcRenderer.on('producto-updated', (_event) => callback()),


    // métodos de los proveedores
    obtenerTodosProveedores: () => ipcRenderer.invoke('obtener-todos-proveedores'),
    crearProveedor: (proveedor) => ipcRenderer.invoke('crear-proveedor', proveedor),
    eliminarProveedor: (id) => ipcRenderer.invoke('eliminar-proveedor', id),
    obtenerProveedorPorId: (id) => ipcRenderer.invoke('obtener-proveedor-por-id', id),
    editarProveedor: (proveedor) => ipcRenderer.invoke('editar-proveedor', proveedor),
    onProveedorEditar: (callback) => ipcRenderer.on('proveedor-editar', (_event, proveedor) => callback(proveedor)),
    onProveedoresUpdated: (callback) => ipcRenderer.on('proveedor-updated', (_event) => callback()),

    // categorías
    obtenerTodasCategorias: () => ipcRenderer.invoke('obtener-todas-categorias'),
    crearCategoria: (categoria) => ipcRenderer.invoke('crear-categoria', categoria),
    editarCategoria: (categoria) => ipcRenderer.invoke('editar-categoria', categoria),
    eliminarCategoria: (id) => ipcRenderer.invoke('eliminar-categoria', id),

    // ubicaciones
    obtenerTodasUbicaciones: () => ipcRenderer.invoke('obtener-todas-ubicaciones'),
    crearUbicacion: (ubicacion) => ipcRenderer.invoke('crear-ubicacion', ubicacion),
    editarUbicacion: (ubicacion) => ipcRenderer.invoke('editar-ubicacion', ubicacion),
    eliminarUbicacion: (id) => ipcRenderer.invoke('eliminar-ubicacion', id),
    obtenerPasillos: () => ipcRenderer.invoke('obtener-pasillos'),
    obtenerEstantes: (pasillo) => ipcRenderer.invoke('obtener-estantes', pasillo),
    obtenerZonas: (pasillo, estante) => ipcRenderer.invoke('obtener-zonas', { pasillo, estante }),
    obtenerUbicacionesDisponibles: () => ipcRenderer.invoke('obtener-ubicaciones-disponibles'),
    obtenerUbicacionesDisponiblesYAsignadas: (idProducto) => ipcRenderer.invoke('obtener-ubicaciones-disponibles-y-asignadas', idProducto),


    // movimientos
    obtenerTodosMovimientos: () => ipcRenderer.invoke('obtener-todos-movimientos'),
    crearMovimiento: (movimiento) => ipcRenderer.invoke('crear-movimiento', movimiento),
    eliminarMovimiento: (id) => ipcRenderer.invoke('eliminar-movimiento', id),
    onMovimientosUpdated: (callback) => ipcRenderer.on('movimientos-updated', (_event) => callback()),

    // apertura de ventanas genéricas
    abrirVentana: (nombre, datos = null) => ipcRenderer.send('abrir-ventana', nombre, datos),
    abrirVentanaEditar: (opciones) => ipcRenderer.send('abrir-ventana-editar', opciones),
    recargarVentana: (nombre) => ipcRenderer.send('recargar-ventana', nombre),

    // eventos genéricos
    onEvento: (nombre, callback) => ipcRenderer.on(nombre, callback),
    enviarEvento: (nombre) => ipcRenderer.send(nombre),

    // métodos para validaciones adicionales de los productos
    validarProducto: (producto) => ipcRenderer.invoke('validar-producto', producto),
    validarId: (id) => ipcRenderer.invoke('validar-id', id)
});
