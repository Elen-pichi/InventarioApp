// cargamos las funciones para mostrar en la vista los listados de categorias, ubicaciones y proveedores existentes en la base de datos
document.addEventListener("DOMContentLoaded", async () => {
    await cargarOpcionesCategorias();
    await cargarOpcionesUbicaciones();
    await cargarOpcionesProveedores();
  });

//capturar el evento de envío del formulario
document.getElementById("form-crear-producto")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectUbicacion = document.getElementById('ubicacion');
    const ubicacionesSeleccionadas = Array.from(selectUbicacion.selectedOptions).map(opt => parseInt(opt.value));

    const producto = {
        codigo: document.getElementById('codigo').value,
        producto: (document.getElementById('producto').value).toUpperCase(),
        stock: parseInt(document.getElementById('stock').value),
        categoria: parseInt(document.getElementById('categoria').value),
        precio: parseFloat(document.getElementById('precio').value),
        ubicaciones: ubicacionesSeleccionadas, 
        proveedor: parseInt(document.getElementById('proveedor').value)
    };

    try {
        console.log("Enviando nuevo producto a la base de datos...", producto);
        await window.api.crearProducto(producto);
        console.log("Producto creado con éxito.");
        window.close();
    } catch (error) {
        console.error("Error al crear el producto:", error.message);
    }
});
// función para cargar las Opciones de las Categorías en un <select> en el formulario 
async function cargarOpcionesCategorias() {
    const categorias = await window.api.obtenerTodasCategorias();
    const select = document.getElementById('categoria');
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
}

// función para cargar las Opciones de las Ubicaciones Disponibles en un <select> en el formulario
async function cargarOpcionesUbicaciones() {
    const ubicaciones = await window.api.obtenerUbicacionesDisponibles();
    const select = document.getElementById('ubicacion');
    ubicaciones.forEach(ubicacion => {
        const option = document.createElement('option');
        option.value = ubicacion.id;
        option.textContent = `Pasillo ${ubicacion.pasillo} - Estante ${ubicacion.estante} - Zona ${ubicacion.zona}`;
        select.appendChild(option);
    });
}

// función para cargar las Opciones de los Proveedores en un <select> en el formulario
async function cargarOpcionesProveedores() {
    const proveedores = await window.api.obtenerTodosProveedores();
    const select = document.getElementById('proveedor');
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.id;
        option.textContent = proveedor.nombre;
        select.appendChild(option);
    });
}
