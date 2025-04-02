const path = require('path');
const { SCHEMA } = require('sqlite3');

const rutas = {
    // rutas principales
    DB_PATH: path.join(__dirname, '../../db/database.sqlite'),
    SCHEMA_PATH: path.join(__dirname, '../../db/schema.sql'),
    PUBLIC_PATH: path.join(__dirname, '../../public'),
    VISTAS_PATH: path.join(__dirname, '../../src/vistas'),
    CONTROLADORES_PATH: path.join(__dirname, '../src/controladores'),
    MODELOS_PATH: path.join(__dirname, '../../src/modelos'),

    // rutas de archivos principales
    PRELOAD_PATH: path.join(__dirname, './preload.js'),
    INDEX_HTML: path.join(__dirname, '../../src/vistas/index.html'),

    // rutas específicas de vistas usuarios
    LOGIN_HTML: path.join(__dirname, '../../src/vistas/usuarios/login.html'),
    USUARIOS_HTML: path.join(__dirname, '../../src/vistas/usuarios/usuarios.html'),
    RENDERER_LOGIN: path.join(__dirname, '../../src/js/usuarios/rendererLogin.js'),
    RENDERER_USUARIOS: path.join(__dirname, '../../src/js/usuarios/rendererUsuarios.js'), // más adelante

    // rutas específicas de vistas productos
    PRODUCTOS_HTML: path.join(__dirname, '../../src/vistas/productos/productos.html'),
    CREAR_PRODUCTO_HTML: path.join(__dirname, '../../src/vistas/productos/crearProducto.html'),
    EDITAR_PRODUCTO_HTML: path.join(__dirname, '../../src/vistas/productos/editarProducto.html'),
    // ruras específicas de renderer productos
    RENDERER_PRODUCTOS: path.join(__dirname, '../../src/js/productos/rendererProductos.js'),
    RENDERER_CREAR_PRODUCTO: path.join(__dirname, '../../src/js/productos/rendererCrearProducto.js'),
    RENDERER_EDITAR_PRODUCTO: path.join(__dirname, '../../src/js/productos/rendererEditarProducto.js'),

    //rutas específicas de vistas proveedores
    PROVEEDORES_HTML: path.join(__dirname, '../../src/vistas/proveedores/proveedores.html'),
    CREAR_PROVEEDOR_HTML: path.join(__dirname, '../../src/vistas/proveedores/crearProveedor.html'),
    EDITAR_PROVEEDOR_HTML: path.join(__dirname, '../../src/vistas/proveedores/editarProveedor.html'),
    RENDERER_PROVEEDORES: path.join(__dirname, '../../src/js/proveedores/rendererProveedores.js'),
    RENDERER_CREAR_PROVEEDOR: path.join(__dirname, '../../src/js/rendererCrearProveedor.js'),
    RENDERER_EDITAR_PROVEEDOR: path.join(__dirname, '../../src/js/rendererEditarProveedor.js'),

    //rutas específicas de vistas categorías
    CATEGORIAS_HTML: path.join(__dirname, '../../src/vistas/categorias/categorias.html'),
    RENDERER_CATEGORIAS: path.join(__dirname, '../../src/js/categorias/rendererCategorias.js'),

    //rutas específicas de vistas ubicaciones
    UBICACIONES_HTML: path.join(__dirname, '../../src/vistas/ubicaciones/ubicaciones.html'),
    RENDERER_UBICACIONES: path.join(__dirname, '../../src/js/ubicaciones/rendererUbicaciones.js'),

    //rutas específicas de vistas movimientos
    MOVIMIENTOS_HTML: path.join(__dirname, '../../src/vistas/movimientos/movimientos.html'),
    RENDERER_MOVIMIENTOS: path.join(__dirname, '../../src/js/movimientos/rendererMovimientos.js'),
    CREAR_ENTRADA_HTML: path.join(__dirname, '../../src/vistas/movimientos/crearEntrada.html'),
    CREAR_SALIDA_HTML: path.join(__dirname, '../../src/vistas/movimientos/crearSalida.html'),

    INFORMES_HTML: path.join(__dirname, '../../src/vistas/informes/informes.html')
};

module.exports = rutas;