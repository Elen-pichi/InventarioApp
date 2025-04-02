
let productoRecibido = null;

// esperamos a que se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.api.onProductoEditar(async (producto) => {
        console.log("📝 Producto a editar:", producto);
        productoRecibido = producto;

        await cargarOpcionesCategorias();
        //await cargarOpcionesUbicaciones(producto);  // 👈 pasamos el producto
        await cargarOpcionesProveedores();
        await cargarOpcionesUbicaciones(producto.id);



        // Rellenamos el formulario
        document.getElementById('id').value = producto.id;
        document.getElementById('codigo').value = producto.codigo;
        document.getElementById('producto').value = producto.producto;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('categoria').value = producto.id_categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('proveedor').value = producto.id_proveedor;
    });

    // manejamos el envío del formulario
    const formEditar = document.getElementById('form-editar-producto');
    formEditar?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectUbicacion = document.getElementById('ubicacion');
        const ubicacionesSeleccionadas = Array.from(selectUbicacion.selectedOptions).map(opt => parseInt(opt.value));

        const productoEditado = {
            id: parseInt(document.getElementById('id').value),
            codigo: document.getElementById('codigo').value,
            producto: document.getElementById('producto').value.toUpperCase(),
            stock: parseInt(document.getElementById('stock').value),
            categoria: parseInt(document.getElementById('categoria').value),
            precio: parseFloat(document.getElementById('precio').value),
            proveedor: parseInt(document.getElementById('proveedor').value),
            ubicaciones: ubicacionesSeleccionadas
        };

        try {
            await window.api.editarProducto(productoEditado);
            console.log("✅ Producto actualizado exitosamente");
            window.close(); // cerrar la ventana al finalizar
        } catch (error) {
            console.error("❌ Error al actualizar el producto:", error.message);
        }
    });
});

// funciones de cargar opciones categorias, ubicaciones y proveedores

async function cargarOpcionesCategorias() {
    const categorias = await window.api.obtenerTodasCategorias();
    const select = document.getElementById('categoria');
    select.innerHTML = '<option value="">-- Selecciona una categoría --</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        select.appendChild(option);
    });
}

async function cargarOpcionesUbicaciones(idProducto) {
    const ubicaciones = await window.api.obtenerUbicacionesDisponiblesYAsignadas(idProducto);
    const select = document.getElementById('ubicacion');
    select.innerHTML = ''; // limpiar antes

    ubicaciones.forEach(ubicacion => {
        const option = document.createElement('option');
        option.value = ubicacion.id;
        option.textContent = `Pasillo ${ubicacion.pasillo} - Estante ${ubicacion.estante} - Zona ${ubicacion.zona}`;

        // si esta ubicación está entre las del producto, márcala seleccionada
        if (productoRecibido.ubicaciones?.includes(ubicacion.id)) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

async function cargarOpcionesProveedores() {
    const proveedores = await window.api.obtenerTodosProveedores();
    const select = document.getElementById('proveedor');
    select.innerHTML = '<option value="">-- Selecciona un proveedor --</option>';
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.id;
        option.textContent = proveedor.nombre;
        select.appendChild(option);
    });
}
