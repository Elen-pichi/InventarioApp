document.addEventListener('DOMContentLoaded', () => {
  console.log("Página de salida de productos cargada.");

  const inputNombre = document.getElementById('nombreBusqueda');
  inputNombre.addEventListener('input', buscarProductoPorNombre);
});

let productoSeleccionado = null;

// buscar producto por código
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

    productoSeleccionado = producto;
    mostrarDatosProducto(producto);
  } catch (error) {
    console.error("Error al buscar el producto por código:", error.message);
    mensajeError.textContent = "Error al buscar el producto por código.";
    mensajeError.style.display = 'block';
  }
}

// buscar productos por nombre con LIKE
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
    const mensajeError = document.getElementById('mensajeError');
    //mensajeError.style.display = 'block';
  }
}

// mostrar lista en el <select>
function mostrarResultadosBusqueda(productos) {
  const select = document.getElementById('resultadoBusqueda');
  const contenedor = document.getElementById('contenedorSelect');
  contenedor.style.display = 'block';

  select.innerHTML = '<option value="">-- Selecciona un producto --</option>';

  productos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.id;
    option.textContent = `${p.producto} (${p.codigo})`;
    option.dataset.nombre = p.producto;
    option.dataset.ubicacion = p.ubicacion;
    option.dataset.stock = p.stock;
    select.appendChild(option);
    });  
}

// Al seleccionar un producto en el <select>
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
    ubicacion: selected.dataset.ubicacion,
    stock: parseInt(selected.dataset.stock)
  };

  productoSeleccionado = producto;
  mostrarDatosProducto(producto);
}

// mostrar los datos en los campos
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

  document.getElementById('stockProducto').value = producto.stock;
  document.getElementById('datosProducto').style.display = 'block';
}

// registrar la salida (disminuir stock)
async function registrarSalida() {
  const cantidad = parseInt(document.getElementById('cantidadSalida').value);

  if (!productoSeleccionado) {
    return alert("Primero selecciona un producto válido.");
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    return alert("Introduce una cantidad válida mayor a cero.");
    
  }

  try {
    await window.api.disminuirStock({ id: productoSeleccionado.id, cantidad });

    await window.api.crearMovimiento({
      id_producto: productoSeleccionado.id,
      tipo: 'salida',
      cantidad
    });

    console.log("Stock actualizado y movimiento registrado correctamente.");
    alert("Salida registrada correctamente.");

    // preguntamos si desea registrar otra salida o no, en caso afirmativo, recarga la página
    const continuar = confirm("¿Deseas registrar otra salida?");
    if (continuar) {
      window.api.recargarVentana('crearSalida');
    } else {
      window.close();
    }
  } catch (error) {
    console.error("Error al registrar salida:", error.message);

    // Si es un error por falta de stock
    if (error.message.includes("Stock insuficiente")) {
      try {
        // Obtenemos el stock actual del producto
        const productoActual = await window.api.obtenerProductoPorId(productoSeleccionado.id);
        alert(`No hay suficiente stock disponible.\nStock actual: ${productoActual.stock}`);
        window.api.recargarVentana('crearSalida');
      } catch (innerError) {
        console.error("Error al obtener el stock actual:", innerError.message);
        alert("No hay suficiente stock disponible, y no se pudo verificar el stock actual.");
      }
    } else {
      alert("Ocurrió un error al registrar la salida.");
    }
  }
}



