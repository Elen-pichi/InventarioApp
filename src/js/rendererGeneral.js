//al requirir electron en preload.js, ya no es necesario requrirlo aquí, ya que aquí necesitamos cargar las "apis" desde el preload.js

if (typeof window === 'undefined') {
    throw new Error('Este archivo solo debe ejecutarse en el proceso de renderizado');
}

// ya tenemos acceso a window.api por el preload por lo que no usamos requerimos window.api

// abrir la ventana de gestión de productos
function abrirGestionProductos() {
    console.log("Abriendo gestión de productos...");
    window.api.abrirVentana('productos');
}

// abrir la ventana de gestión de proveedores
function abrirProveedores() {
    console.log("Abriendo gestión de proveedores...");
    window.api.abrirVentana('proveedores');
}

// abrir la ventana de informes
function abrirMovimientos() {
    console.log("Abriendo informes...");
    window.api.abrirVentana('movimientos');
}

// abrir la ventana de entradas de stock
function abrirEntrada() {
    console.log("Abriendo formulario de entrada de producto...");
    window.api.abrirVentana('crearEntrada'); // Vista futura: crearEntrada.html
}

// abrir la ventana de salidas de stock
function abrirSalida() {
    console.log("Abriendo formulario de salida de producto...");
    window.api.abrirVentana('crearSalida'); // Vista futura: crearSalida.html
}

// suscripción global al evento producto-updated
window.api.onProductosUpdated(() => {
    console.log("Productos actualizados. Refrescando interfaz...");

    // solo refresca si existe la función en la página actual
    if (typeof actualizarListadoProductos === "function") {
        actualizarListadoProductos();
    }
});

// actualizar opciones de categorias
window.actualizarOpcionesCategorias = async function () {
    const categorias = await window.api.obtenerTodasCategorias();
    const select = document.getElementById('categoria');
    if (!select) return;

    select.innerHTML = '';

    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.nombre;
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
};

// actualizar opciones de ubicaciones 
window.actualizarOpcionesUbicaciones = async function () {
    try {
        const ubicaciones = await window.api.obtenerTodasUbicaciones();
        const select = document.getElementById('ubicacion');
        if (!select) return;

        select.innerHTML = '';

        ubicaciones.forEach(ubicacion => {
            const opcion = document.createElement('option');
            opcion.value = ubicacion.id;
            opcion.textContent = `${ubicacion.pasillo} - Estante ${ubicacion.estante} - Zona ${ubicacion.zona}`;
            select.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al actualizar el select de ubicaciones:", error.message);
    }
};


// recuperar la sesión del usuario actual y si su rol no es administrador no puede ver los botones siguientes
window.api.obtenerUsuarioActual().then(usuario => {
    if (!usuario || usuario.rol !== 'admin') {
        document.querySelectorAll('.solo-admin').forEach(el => {
            el.style.display = 'none';
        });
    }
});

window.logout = async function () {
    await window.api.logout();
};
  