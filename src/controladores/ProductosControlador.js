// fichero que maneja la lógica de negocio de los productos y que captura los errores a través de try/catch y llama a los métodos del ProductosModelo.js

const Producto = require('../modelos/ProductosModelo');
console.log("✅ ProductosControlador cargado");

class ProductosControlador {
    // obtener todos los productos del almacén
    static async obtenerTodosProductos() {
        try {
            return await Producto.obtenerTodosProductos();
        } catch (error) {
            console.error("Error al obtener los datos de los productos del almacén: ", error.message);
            throw error;
        }
    }

 // agregar un producto nuevo al almacen
    static async crearProducto(codigo, producto, stock, categoria, precio, ubicaciones, proveedor) {
        try {
            console.log("🧪 Entrando a ProductosControlador.crearProducto", { codigo, producto, stock, categoria, precio, ubicaciones, proveedor });

            return await Producto.crearProducto(codigo, producto, stock, categoria, precio, ubicaciones, proveedor);
        } catch (error) {
            console.error("Error al agregar un nuevo producto al almacén desde el controlador: ", error.message);
            throw error;
        }
    }

    static async obtenerProductoPorId(id) {
        try {
            console.log("🧪 Entrando a ProductosControlador.obtenerProductoPorId: ", id);
            return await Producto.obtenerProductoPorId(id);
        } catch (error) {
            console.error("Error al obtener el producto por id desde el controlador: ", error.message);
            throw error;
        }
    }

    // obtener ubicaciones asociadas a un producto
    static async obtenerUbicacionesPorProducto(idProducto) {
        try {
            console.log("Obteniendo Ubicaciones Por Producto: ", idProducto);
            return await Producto.obtenerUbicacionesPorProducto(idProducto);
        } catch (error) {
            console.error("Error al obtener ubicaciones del producto: ", error.message);
            throw error;
        }
    }

    // actualizar un producto existente
    static async editarProducto(id, codigo, producto, stock, categoria, precio, ubicaciones, proveedor) {
        try {
            console.log("🧪 Entrando a ProductosControlador.editarProducto", { codigo, producto, stock, categoria, precio, ubicaciones, proveedor });
            return await Producto.editarProducto(id, codigo, producto, stock, categoria, precio, ubicaciones, proveedor);
        } catch (error) {
            console.error("Error al actualizar un producto existente en el almacén: ", error.message);
            throw error;
        }
    }

    // eliminar un producto existente
    static async eliminarProducto(id) {
        try {
            return await Producto.eliminarProducto(id);
        } catch (error) {
            console.error("Error al eliminar un producto del almacén desde el controlador: ", error.message);
            throw error;
        }
    }


    // aumentar stock de un producto
    static async aumentarStock(id_producto, cantidad) {
        try {
            return await Producto.aumentarStock(id_producto, cantidad);
        } catch (error) {
            console.error("Error al aumentar el stock del producto desde el controlador: ", error.message);
            throw error;
        }
    }

    // disminuir stock de un producto
    static async disminuirStock(id_producto, cantidad) {
        try {
            return await Producto.disminuirStock(id_producto, cantidad);
        } catch (error) {
            console.error("Error al disminuir el stock del producto desde el controlador: ", error.message);
            throw error;
        }
    }

    // buscar producto por código
    static async buscarPorCodigo(codigo) {
        try {
            return await Producto.buscarPorCodigo(codigo);
        } catch (error) {
            console.error("Error al buscar producto por código desde el controlador: ", error.message);
            throw error;
        }
    }

    // buscar producto por nombre
    static async buscarPorNombre(nombre) {
        try {
            return await Producto.buscarPorNombre(nombre);
        } catch (error) {
            console.error("Error al buscar producto por nombre desde el controlador: ", error.message);
            throw error;
        }
    }

}

module.exports = ProductosControlador;


