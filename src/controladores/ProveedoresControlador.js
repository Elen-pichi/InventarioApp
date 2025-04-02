// fichero que maneja la lógica de negocio de los proveedores. Llama a los métodos del ProveedoresModelo.js

const Proveedor = require('../modelos/ProveedoresModelo');

class ProveedoresControlador {

    // obtener todos los proveedores registrados en la base de datos
    static async obtenerTodosProveedores() {
        try {
            return await Proveedor.obtenerTodosProveedores();
        } catch (error) {
            console.error("Erros al obtener los datos de los proveedores: ", error.message);
            throw error;
        }
    }

    // registrar o crear un nuevo proveedor
    static async crearProveedor(nombre, direccion, email, telefono, contacto) {
        try {
            return await Proveedor.crearProveedor(nombre, direccion, email, telefono, contacto);
        } catch (error) {
            console.error("Error al agregar un nuevo proveedor: ", error.message);
            throw error;
        }
    }

    //editar un proveedor existente: obtenerProveedorPorId y editarProveedor
    static async obtenerProveedorPorId(id) {
        try {
            return await Proveedor.obtenerProveedorPorId(id);
        } catch (error) {
            console.error("Error al obtener el proveedor por id en el controlador: ", error.message);
            throw error;
        }
    }
    static async editarProveedor(id, nombre, direccion, email, telefono, contacto) {
        try {
            return await Proveedor.editarProveedor(id, nombre, direccion, email, telefono, contacto);
        } catch (error) {
            console.error("Error al actualizar un producto desde el controlador: ", error.message);
            throw error;
        }
    }

    //eliminar un proveedor
    static async eliminarProveedor(id) {
        try {
            return await Proveedor.eliminarProveedor(id);
        } catch (error) {
            console.error("Error al eliminar un proveedor en el controlador: ", error.message);
            throw error;
        }
    }
}

module.exports = ProveedoresControlador;