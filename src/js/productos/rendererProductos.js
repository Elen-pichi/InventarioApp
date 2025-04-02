//al requirir electron en preload.js, ya no es necesario requerirlo aquí, ya que aquí necesitamos cargar las "apis" desde el preload.js
/** fichero que maneja los eventos en la interfaz del usuario */

// Verificar que este script solo se ejecuta en el proceso de renderizado
if (typeof window === 'undefined') {
    console.error("Error: rendererProductos.js solo debe ejecutarse en el proceso de renderizado.");
    throw new Error("rendererProductos.js solo debe ejecutarse en el proceso de renderizado.");
}

const ipcRenderer = window.api;

document.addEventListener("DOMContentLoaded", async () => {

    if (!window.api) {
        console.error("Error: window.api no está definido. Verifica que preload.js está correctamente cargado.");
        return;
    }

    try {
        console.log("Cargando producto desde la base de datos...");
        const producto = await window.api.obtenerTodosProductos();
        console.log("Productos cargados:", producto);
        mostrarProductos(producto);
        // se cargan las categorías en el <select> en caso de que existan
       // await actualizarOpcionesCategorias();
    } catch (error) {
        console.error("Error al obtener producto:", error.message);
    }
});


// Escucha el evento 'producto-updated'
window.api.onProductosUpdated(() => {
    console.log("Listado de producto actualizado automáticamente.");
    actualizarListadoProductos();
});

// Función para refrescar el listado de producto en el almacen
function actualizarListadoProductos() {
    window.api.obtenerTodosProductos()
        .then(producto => {
            mostrarProductos(producto);
        })
        .catch(err => {
            console.error("Error al actualizar listado de producto:", err);
        });
}


// mostrar producto en la tabla
function mostrarProductos(producto) {
    const tabla = document.getElementById('tabla-productos');
    if (!tabla) return;

    tabla.innerHTML = '';

    producto.forEach((producto, contador) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${contador + 1}</td>
            <td>${producto.codigo}</td>
            <td>${producto.producto}</td>
            <td>${producto.stock}</td>
            <td>${producto.categoria}</td>
            <td>${Number(producto.precio).toFixed(2)}</td>
            <td>${producto.ubicaciones || 'Sin asignar'}</td> <!-- mostrar todas las ubicaciones -->
            <td>${producto.proveedor || 'Sin proveedor'}</td>
            <td class="text-center">
                <div class="btn-group btn-group-sm d-flex justify-content-center" role="group" aria-label="Acciones">
                    <button type="button" class="btn btn-primary px-2 py-0" onclick="editarProducto(${producto.id})">
                    <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-danger px-2 py-0" onclick="eliminarProducto(${producto.id}, '${producto.producto}')">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

//función para abrir la ventana para crear un nuevo producto
function abrirCrearProducto() {
    console.log("Abriendo formulario para crear un nuevo producto...");
    window.api.abrirVentana('crearProducto');
}


// función que se ejecuta en la vista productos.html y guarda los datos del producto a editar
async function editarProducto(id) {
    try {
        const producto = await window.api.obtenerProductoPorId(id);
        if (!producto) {
            console.error("Producto no encontrado.");
            return;
        }

        // obtener las ubicaciones asociadas al producto
        const ubicaciones = await window.api.obtenerUbicacionesDeProducto(id);
        producto.ubicaciones = ubicaciones.map(u => u.id); // solo los IDs

        console.log("Producto a editar: ", producto);

        window.api.abrirVentanaEditar({
            tipo: 'editarProducto',
            datos: producto
        });
    } catch (error) {
        console.error("Error al buscar el producto: ", error.message);
    }
}


function eliminarProducto(id, producto) {
    // solicitud de confirmación del registro previamente antes de eliminar
    if (confirm(`¿Estás seguro de eliminar el producto "${producto}" ?`)) {
        window.api.eliminarProducto(id)
            .then(resultado => {
                console.log("Producto eliminado correctamente:", resultado);
                // No es necesario actualizar manualmente, ya que se emite el evento 'producto-updated'
            })
            .catch(error => {
                console.error("Error al eliminar el producto:", error);
            });
    }
}

function abrirCategorias() {
    window.api.abrirVentana('categorias');
}

function abrirUbicaciones() {
    window.api.abrirVentana('ubicaciones');
}

// se actualizan las categorías en la vista de productos cada vez que creemos, editemos o modifiquemos una categoría
window.api.onEvento('categorias-updated', async () => {
    if (typeof actualizarOpcionesCategorias === 'function') {
        await actualizarOpcionesCategorias();
    }
});
