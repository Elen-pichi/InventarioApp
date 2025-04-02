if (typeof window === 'undefined') {
    console.error("Error: rendererUbicaciones.js solo debe ejecutarse en el proceso de renderizado.");
    throw new Error("rendererUbicaciones.js solo debe ejecutarse en el proceso de renderizado.");
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.api) {
        console.error("Error: window.api no está definido. Verifica que preload.js esté correctamente cargado");
        return;
    }

    try {
        console.log("Cargando ubicaciones desde la base de datos...");
        await actualizarListadoUbicaciones();
    } catch (error) {
        console.error("Error al obtener ubicaciones:", error.message);
    }
});

window.api.onEvento('ubicaciones-updated', async () => {
    try {
        console.log("Listado de ubicaciones actualizado automáticamente.");
        await actualizarListadoUbicaciones();
    } catch (error) {
        console.error("Error al actualizar ubicaciones tras evento:", error.message);
    }
});

async function actualizarListadoUbicaciones() {
    try {
        const ubicaciones = await window.api.obtenerTodasUbicaciones();
        mostrarUbicaciones(ubicaciones);
    } catch (err) {
        console.error("Error al actualizar el listado de ubicaciones:", err.message);
    }
}

function mostrarUbicaciones(ubicaciones) {
    const tbody = document.getElementById('tabla-ubicaciones');
    tbody.innerHTML = '';

    ubicaciones.forEach((ubicacion, contador) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${contador + 1}</td>
        <td id="pasillo-${ubicacion.id}">${ubicacion.pasillo}</td>
        <td id="estante-${ubicacion.id}">${ubicacion.estante}</td>
        <td id="zona-${ubicacion.id}">${ubicacion.zona}</td>
        <td>
          <button class="btn btn-warning btn-sm py-0 me-2" onclick="editarUbicacion(${ubicacion.id}, '${ubicacion.pasillo}', '${ubicacion.estante}', '${ubicacion.zona}')"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn btn-danger btn-sm py-0" onclick="eliminarUbicacion(${ubicacion.id})"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
        tbody.appendChild(fila);
    });
}

async function crearUbicacion() {
    const pasillo = document.getElementById('nuevoPasillo').value.trim().toUpperCase();
    const estante = document.getElementById('nuevoEstante').value.trim().toUpperCase();
    const zona = document.getElementById('nuevaZona').value.trim().toUpperCase();

    if (!pasillo || !estante || !zona) return alert('Todos los campos son obligatorios');

    try {
        const resultado = await window.api.crearUbicacion({ pasillo, estante, zona });
        if (resultado?.error) {
            alert(resultado.error);
        } else {
            document.getElementById('nuevoPasillo').value = '';
            document.getElementById('nuevoEstante').value = '';
            document.getElementById('nuevaZona').value = '';
            await actualizarListadoUbicaciones();
            window.api.enviarEvento('ubicaciones-updated');
        }
    } catch (error) {
        if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: ubicaciones.pasillo, ubicaciones.estante, ubicaciones.zona')) {
            alert("Ya existe una ubicación con esos datos.");
            cancelarCreacion();         
        }
        console.error("Error al crear nueva ubicación:", error.message);
    }
}

function editarUbicacion(id, pasillo, estante, zona) {
    document.getElementById(`pasillo-${id}`).innerHTML = `<input type="text" id="input-pasillo-${id}" class="form-control" value="${pasillo}">`;
    document.getElementById(`estante-${id}`).innerHTML = `<input type="text" id="input-estante-${id}" class="form-control" value="${estante}">`;
    document.getElementById(`zona-${id}`).innerHTML = `<input type="text" id="input-zona-${id}" class="form-control" value="${zona}">`;

    const fila = document.getElementById(`pasillo-${id}`).parentElement;
    fila.querySelector('td:last-child').innerHTML = `
      <button class="btn btn-primary btn-sm me-2 py-0" onclick="guardarEdicion(${id})">Guardar</button>
      <button class="btn btn-secondary btn-sm py-0" onclick="cancelarEdicion()">Cancelar</button>
    `;
}

async function guardarEdicion(id) {
    const pasillo = document.getElementById(`input-pasillo-${id}`).value.trim().toUpperCase();
    const estante = document.getElementById(`input-estante-${id}`).value.trim().toUpperCase();
    const zona = document.getElementById(`input-zona-${id}`).value.trim().toUpperCase();

    if (!pasillo || !estante || !zona) return alert('Todos los campos son obligatorios');

    try {
        const resultado = await window.api.editarUbicacion({ id, pasillo, estante, zona });
        if (resultado?.error) {
            alert(resultado.error);
        } else {
            await actualizarListadoUbicaciones();
            window.api.enviarEvento('ubicaciones-updated');
        }
    } catch (error) {
        if (error.message.includes('SQLITE_CONSTRAINT: UNIQUE constraint failed: ubicaciones.pasillo, ubicaciones.estante, ubicaciones.zona')) {
            alert("Ya existe una ubicación con esos datos.");
            // se indica que vuelva a la pantalla en la que estaba en vez de cerrarse inesperadamente.
            return;
        }
        console.error("Error al guardar cambios de la ubicación:", error.message);
    }
}

async function eliminarUbicacion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta ubicación?')) {
        try {
            const resultado = await window.api.eliminarUbicacion(id);
            if (resultado?.error) {
                alert(resultado.error);
            } else {
                await actualizarListadoUbicaciones();
                window.api.enviarEvento('ubicaciones-updated');
            }
        } catch (error) {
            console.error("Error al eliminar ubicación:", error.message);
        }
    }
}

function cancelarCreacion() {
    document.getElementById('nuevoPasillo').value = '';
    document.getElementById('nuevoEstante').value = '';
    document.getElementById('nuevaZona').value = '';
}

function cancelarEdicion() {
    actualizarListadoUbicaciones();
}
