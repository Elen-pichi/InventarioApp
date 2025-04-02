if (typeof window === 'undefined') {
    console.error("Error: rendererProveedores.js solo debe ejecutarse en el proceso de renderizado.");
    throw new Error("rendererProveedores.js solo debe ejecutarse en el proceso de renderizado.");
}

const ipcRenderer = window.api;

document.addEventListener("DOMContentLoaded", async () => {
    if (!window.api) {
        console.error("Error: window.api no está definido. Verifica que preload.js esté correctamente cargado");
        return;
    }
    try {
        console.log("Cargando proveedores desde la base de datos...");
        const proveedor = await window.api.obtenerTodosProveedores();
        console.log("Proveedores cargados: ", proveedor);
        mostrarProveedores(proveedor);
    } catch (error) {
        console.error("Error al obtener proveedor: ", error.message);
    }
});

// escucha el evento 'proveedor-updated' para actualizar el listado de proveedores
window.api.onProveedoresUpdated(() => {
    alert("Proveedor actualizado. Refrescando listado...");
    console.log("Listado de proveedores actualizado automáticamente.");
    actualizarListadoProveedores();
});
// función que refresca el listado de proveedores en el almacén, llama a la api y maneja errores
function actualizarListadoProveedores() {
    window.api.obtenerTodosProveedores()
        .then(proveedor => {
            mostrarProveedores(proveedor);
        })
        .catch(err => {
            console.error("Error al actuzlizar el listado de proveedores: ", err);
        });
}

// mostrar los proveedores en la tabla
function mostrarProveedores(proveedor) {
    console.log("Refrescando tabla con proveedores: ", proveedor);
    const tabla = document.getElementById('tabla-proveedores');
    if (!tabla) return;

    tabla.innerHTML = '';

    proveedor.forEach((proveedor, contador) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${contador + 1}</td>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.direccion}</td>
            <td>${proveedor.email}</td>
            <td>${proveedor.telefono}</td>
            <td>${proveedor.contacto}</td>
            <td class="text-center">
                <div class="btn-group btn-group-sm d-flex justify-content-center" role="group" aria-label="Acciones">
                    <button type="button" class="btn btn-primary px-2 py-1" onclick="editarProveedor(${proveedor.id})">
                    <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-danger px-2 py-1" onclick="eliminarProveedor(${proveedor.id}, '${proveedor.nombre}')">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

// función para abrir la ventana para crear un nuevo proveedor
function abrirCrearProveedor() {
    console.log("Abriendo formulario para crear un nuevo proveedor...");
    window.api.abrirVentana('crearProveedor');
}

// función que se ejecuta en la vista proveedores.html y guarda los datos del proveedor a editar
async function editarProveedor(id) {
    try {
        const proveedor = await window.api.obtenerProveedorPorId(id);
        if (!proveedor) {
            console.error("Proveedor no encontrado.");
            return;
        }
        console.log("Proveedor a Editar: ", proveedor);
        window.api.abrirVentanaEditar({
            tipo: 'editarProveedor',
            datos: proveedor
        });
    } catch (error) {
        console.error("Error al obtener el producto por id en rendererProveedores.js: ", error.message);
        throw error;
    }

}

function eliminarProveedor(id, nombre) {
    // solicitud de confirmación del registro previamente antes de eliminar
    if (confirm(`¿Estás seguro de eliminar el proveedor "${nombre}" ?`)) {
        window.api.eliminarProveedor(id)
            .then(resultado => {
                console.log("Proveedor eliminado correctamente:", resultado);
            })
            .catch(error => {
                console.error("Error al eliminar el proveedor:", error.message);
            });
    }
}

