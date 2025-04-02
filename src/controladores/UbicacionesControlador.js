const Ubicacion = require('../modelos/UbicacionesModelo');

class UbicacionesControlador {

    //obtener pasillos únicos
    static async obtenerPasillos() {
        try {
            return await Ubicacion.obtenerPasillos();
        } catch (error) {
            console.error("Error al obtener los pasillos únicos desde el controlador: ", error.message);
            throw error;
        }
    }

    //obtener estantes únicos
    static async obtenerEstantes(pasillo) {
        try {
            return await Ubicacion.obtenerEstantes(pasillo);
        } catch (error) {
            console.error("Error al obtener los estantes únicos desde el controlador: ", error.message);
            throw error;
        }
    }

    //obtener zonas únicas
    static async obtenerZonas(pasillo, estante) {
        try {
            return await Ubicacion.obtenerZonas(pasillo, estante);
        } catch (error) {
            console.error("Error al obtener las zonas únicass desde el controlador: ", error.message);
            throw error;
        }
    }

    // obtener las ubicaciones registradas en la base de datos
    static async obtenerTodasUbicaciones() {
        try {
            return await Ubicacion.obtenerTodasUbicaciones();
        } catch (error) {
            console.error("Error al obtener los datos de las ubicaciones desde el controlador: ", error.message);
            throw error;
        }
    }

    // registrar o crear una nueva ubicacion
    static async crearUbicacion(pasillo, estante, zona) {
        try {
            return await Ubicacion.crearUbicacion(pasillo, estante, zona);
        } catch (error) {
            console.error("Error al agregar una nueva Ubicación desde el controlador: ", error.message);
            throw error;
        }
    }

    //editar una ubicación existente, no hace falta obtener el id porque ya está cargado en la misma ventana
    static async editarUbicacion(id, pasillo, estante, zona) {
        try {
            return await Ubicacion.editarUbicacion(id, pasillo, estante, zona);
        } catch (error) {
            console.error("Error al actualizar una ubicación desde el controlador: ", error.message);
            throw error;
        }
    }

    //eliminar una ubicación
    static async eliminarUbicacion(id) {
        try {
            return await Ubicacion.eliminarUbicación(id);
        } catch (error) {
            console.error("Error al eliminar una ubicación en el controlador: ", error.message);
            throw error;
        }
    }

    // obtener ubicaciones disponibles
    static async obtenerUbicacionesDisponibles() {
        try {
            return await Ubicacion.obtenerUbicacionesDisponibles();
        } catch (error) {
            console.error("Error al actualizar las ubicaciones disponibles desde el controlador: ", error.message);
            throw error;
        }
    }

    // obtener ubicaciones disponibles + las que ya tiene un producto
    static async obtenerUbicacionesDisponiblesYAsignadas(idProducto) {
        try {
            return await Ubicacion.obtenerUbicacionesDisponiblesYAsignadas(idProducto);
        } catch (error) {
            console.error("Error al obtener ubicaciones disponibles y asignadas:", error.message);
            throw error;
        }
    }

}

module.exports = UbicacionesControlador;

