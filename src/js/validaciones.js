// función general que valida un Producto
function validarProducto(producto) {
    if (!producto.codigo) return "Falta el código";
    if (!producto.producto) return "Falta el nombre del producto";
    if (producto.stock == null || isNaN(producto.stock)) return "Falta o es inválido el stock";
    if (!producto.categoria) return "Falta la categoría";
    if (producto.precio == null || isNaN(producto.precio)) return "Falta o es inválido el precio";
    if (!Array.isArray(producto.ubicaciones) || producto.ubicaciones.length === 0) return "Falta al menos una ubicación";
    if (!producto.proveedor) return "Falta el proveedor";

    return null; // todo correcto
}


// función general que valida un producto en función de su id
const validarId = (id) => {
    const idNum = parseInt(id);
    if (isNaN(idNum) || idNum <= 0) {
        return "El ID es obligatorio y debe ser un número válido mayor que cero.";
    }
    return null;
};

module.exports = { validarProducto, validarId };