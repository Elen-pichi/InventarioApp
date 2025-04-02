const Categoria = require('../modelos/CategoriasModelo');

class CategoriasControlador {

  // obtener las categorías registradas en la base de datos
  static async obtenerTodasCategorias() {
      try {
          return await Categoria.obtenerTodasCategorias();
      } catch (error) {
          console.error("Error al obtener los datos de las categorías desde el controlador: ", error.message);
          throw error;
      }
  }

  // registrar o crear una nueva categoria
  static async crearCategoria(nombre) {
      try {
          return await Categoria.crearCategoria(nombre);
      } catch (error) {
          console.error("Error al agregar una nueva Categoria desde el controlador: ", error.message);
          throw error;
      }
  }

  //editar una Categoria existente, no hace falta obtener el id porque ya está cargado en la misma ventana
  static async editarCategoria(id, nombre) {
      try {
          return await Categoria.editarCategoria(id, nombre);
      } catch (error) {
          console.error("Error al actualizar una categoría desde el controlador: ", error.message);
          throw error;
      }
  }

  //eliminar un Categoria
  static async eliminarCategoria(id) {
      try {
          return await Categoria.eliminarCategoria(id);
      } catch (error) {
          console.error("Error al eliminar un Categoria en el controlador: ", error.message);
          throw error;
      }
  }
}

module.exports = CategoriasControlador;
