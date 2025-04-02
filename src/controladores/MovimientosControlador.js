const Movimiento = require('../modelos/MovimientosModelo');
const Producto = require('../modelos/ProductosModelo');

class MovimientosControlador {
  // Obtener todos los movimientos
  static async obtenerTodosMovimientos() {
    try {
      return await Movimiento.obtenerTodosMovimientos();
    } catch (error) {
      console.error("Error al obtener movimientos:", error.message);
      throw error;
    }
  }

  // Crear un movimiento (entrada o salida)
  static async crearMovimiento(id_producto, tipo, cantidad) {
    try {
      // Validar tipo
      if (!['entrada', 'salida'].includes(tipo)) {
        throw new Error("Tipo de movimiento no válido. Debe ser 'entrada' o 'salida'.");
      }

      // Obtener el producto
      const producto = await Producto.obtenerProductoPorId(id_producto);
      if (!producto) {
        throw new Error("Producto no encontrado con el ID proporcionado.");
      }

      let nuevoStock = producto.stock;

      if (tipo === 'entrada') {
        nuevoStock += cantidad;
      } else if (tipo === 'salida') {
        if (cantidad > producto.stock) {
          throw new Error("No hay suficiente stock disponible para realizar esta salida.");
        }
        nuevoStock -= cantidad;
      }

      // Actualizar el stock del producto
      await Producto.editarProducto({
        ...producto,
        stock: nuevoStock
      });

      // Registrar el movimiento
      return await Movimiento.crearMovimiento(id_producto, tipo, cantidad);
    } catch (error) {
      console.error("Error al crear movimiento desde el controlador:", error.message);
      throw error;
    }
  }

  // Eliminar un movimiento (opcional)
  static async eliminarMovimiento(id) {
    try {
      return await Movimiento.eliminarMovimiento(id);
    } catch (error) {
      console.error("Error al eliminar movimiento:", error.message);
      throw error;
    }
  }
}

module.exports = MovimientosControlador;
