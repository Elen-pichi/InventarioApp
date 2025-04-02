document.addEventListener('DOMContentLoaded', () => {
  console.log("Página de entrada de productos cargada.");

  const inputNombre = document.getElementById('nombreBusqueda');
  inputNombre.addEventListener('input', buscarProductoPorNombre);
});

let productoEncontrado = null;

// Buscar producto por código
async function buscarProducto() {
  const codigo = document.getElementById('codigo').value.trim();
  const mensajeError = document.getElementById('mensajeError');
  mensajeError.style.display = 'none';
  mensajeError.textContent = '';

  if (!codigo) return;

  try {
    const producto = await window.api.buscarProductoPorCodigo(codigo);
    if (!producto) {
      mensajeError.textContent = "Producto no encontrado por código.";
      mensajeError.style.display = 'block';
      return;
    }

    productoEncontrado = producto;
    mostrarDatosProducto(producto);
  } catch (error) {
    console.error("Error al buscar el producto por código:", error.message);
    mensajeError.textContent = "Error al buscar el producto por código.";
    mensajeError.style.display = 'block';
  }
}

// Buscar productos por nombre con LIKE
async function buscarProductoPorNombre() {
  const nombre = document.getElementById('nombreBusqueda').value.trim();
  const mensajeError = document.getElementById('mensajeError');
  mensajeError.style.display = 'none';
  mensajeError.textContent = '';

  if (!nombre) return;

  try {
    const productos = await window.api.buscarProductoPorNombre(nombre);
    if (!productos || productos.length === 0) {
      mensajeError.textContent = "No se encontraron productos con ese nombre.";
      mensajeError.style.display = 'block';
      return;
    }

    mostrarResultadosBusqueda(productos);
  } catch (error) {
    console.error("Error al buscar productos por nombre:", error.message);
    mensajeError.textContent = "Error al buscar productos por nombre.";
    mensajeError.style.display = 'block';
  }
}

// mostrar lista en el <select>
function mostrarResultadosBusqueda(productos) {
  const select = document.getElementById('resultadoBusqueda');

  const contenedor = document.getElementById('contenedorSelect');
  contenedor.style.display = 'block'; // mostrar select solo tras resultados

  select.innerHTML = '<option value="">-- Selecciona un producto --</option>';

  productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.producto} (${p.codigo})`;
    option.dataset.nombre = p.producto;
    option.dataset.ubicaciones = p.ubicaciones;
    select.appendChild(option);
  });
}

// al seleccionar un producto en el <select>
function seleccionarProductoPorNombre() {
  const select = document.getElementById('resultadoBusqueda');
  const selected = select.options[select.selectedIndex];

  const mensajeError = document.getElementById('mensajeError');
  if (mensajeError) {
    mensajeError.style.display = 'none';
    mensajeError.textContent = '';
  }

  if (!selected.value) return;

  const producto = {
    id: parseInt(selected.value),
    producto: selected.dataset.nombre,
  };

  productoEncontrado = producto;
  mostrarDatosProducto(producto);
}

// función para mostrar los datos del producto
async function mostrarDatosProducto(producto) {
  document.getElementById('nombreProducto').value = producto.producto;

  const ubicacionInput = document.getElementById('ubicacionProducto');

  try {
    const ubicaciones = await window.api.obtenerUbicacionesDeProducto(producto.id);

    if (ubicaciones && ubicaciones.length > 0) {
      const ubicacionStr = ubicaciones.map(u =>
        `${u.pasillo} * ${u.estante} * ${u.zona}  / `
      ).join('');
      ubicacionInput.value = ubicacionStr;
    } else {
      ubicacionInput.value = "Sin ubicaciones asignadas";
    }

  } catch (error) {
    console.error("Error al cargar ubicaciones del producto:", error.message);
    ubicacionInput.value = "Error al cargar ubicaciones";
  }

  document.getElementById('datosProducto').style.display = 'block';
}


// registrar la entrada (aumentar stock)
async function registrarEntrada() {
  const cantidad = parseInt(document.getElementById('cantidadEntrada').value);

  if (!productoEncontrado) {
    return alert("Primero selecciona un producto válido.");
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    return alert("Introduce una cantidad válida mayor a cero.");
  }

  try {
    await window.api.aumentarStock({ id: productoEncontrado.id, cantidad });

    await window.api.crearMovimiento({
      id_producto: productoEncontrado.id,
      tipo: 'entrada',
      cantidad
    });

    console.log("Stock actualizado y movimiento registrado correctamente.");
    alert("Entrada registrada correctamente.");

    // preguntamos si desea registrar otra entrada o no, en caso afirmativo, recarga la página
    const continuar = confirm("¿Deseas registrar otra entrada?");
    if (continuar) {
      window.api.recargarVentana('crearEntrada');
    } else {
      window.close();
    }

  } catch (error) {
    console.error("Error al registrar entrada:", error.message);
    alert("Ocurrió un error al registrar la entrada.");
  }
}


