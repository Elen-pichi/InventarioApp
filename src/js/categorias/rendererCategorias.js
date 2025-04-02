document.addEventListener('DOMContentLoaded', async () => {
  if (!window.api) {
    console.error("Error: window.api no está definido. Verifica que preload.js esté correctamente cargado");
    return;
  }

  try {
    console.log("Cargando categorías desde la base de datos...");
    await actualizarListadoCategorias();
  } catch (error) {
    console.error("Error al obtener categorías en rendererCategorias.js: ", error.message);
  }
});

window.api.onEvento('categorias-updated', async () => {
  try {
    console.log("Listado de categorías actualizado automáticamente.");
    await actualizarListadoCategorias();
  } catch (error) {
    console.error("Error al actualizar categorías tras evento:", error.message);
  }
});

async function actualizarListadoCategorias() {
  try {
    const categorias = await window.api.obtenerTodasCategorias();
    mostrarCategorias(categorias);
  } catch (err) {
    console.error("Error al actualizar el listado de categorías:", err.message);
  }
}

function mostrarCategorias(categorias) {
  const tbody = document.getElementById('tabla-categorias');
  tbody.innerHTML = '';

  categorias.forEach((categoria, contador) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${contador + 1}</td>
      <td id="nombre-${categoria.id}">${categoria.nombre}</td>
      <td>
        <button class="btn btn-warning btn-sm py-0 me-2" onclick="editarCategoria(${categoria.id}, '${categoria.nombre}')"><i class="fa-solid fa-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm py-0" onclick="eliminarCategoria(${categoria.id}, '${categoria.nombre}')"><i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

async function crearCategoria() {
  try {
    const nombre = document.getElementById('nuevaCategoria').value.trim();
    if (!nombre) return alert('El nombre no puede estar vacío.');

    const resultado = await window.api.crearCategoria({ nombre });
    if (resultado?.error) {
      alert(resultado.error);
    } else {
      document.getElementById('nuevaCategoria').value = '';
      await actualizarListadoCategorias();
      window.api.enviarEvento('categorias-updated');
    }
  } catch (error) {
    console.error("Error al crear una nueva categoría:", error.message);
  }
}

function editarCategoria(id, nombreActual) {
  const tdNombre = document.getElementById(`nombre-${id}`);
  tdNombre.innerHTML = `<input type="text" id="input-${id}" class="form-control" value="${nombreActual}">`;

  const fila = tdNombre.parentElement;
  fila.querySelector('td:last-child').innerHTML = `
    <button class="btn btn-primary btn-sm me-2 py-0" onclick="guardarEdicion(${id})">Guardar</button>
    <button class="btn btn-secondary btn-sm py-0" onclick="cancelarEdicion()">Cancelar</button>
  `;
}

async function guardarEdicion(id) {
  try {
    const nuevoNombre = document.getElementById(`input-${id}`).value.trim();
    if (!nuevoNombre) return alert('El nombre no puede estar vacío.');

    const resultado = await window.api.editarCategoria({ id, nombre: nuevoNombre });
    if (resultado?.error) {
      alert(resultado.error);
    } else {
      await actualizarListadoCategorias();
      window.api.enviarEvento('categorias-updated');
    }
  } catch (error) {
    console.error("Error al guardar los cambios de la categoría:", error.message);
  }
}

async function eliminarCategoria(id, nombre) {
  if (confirm(`¿Estás seguro de que deseas eliminar la categoría "${nombre}"?`)) {
    try {
      const resultado = await window.api.eliminarCategoria(id);
      if (resultado?.error) {
        alert(resultado.error);
      } else {
        await actualizarListadoCategorias();
        window.api.enviarEvento('categorias-updated');
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error.message);
    }
  }
}

function cancelarCreacion() {
  document.getElementById('nuevaCategoria').value = '';
}

function cancelarEdicion() {
  actualizarListadoCategorias();
}

