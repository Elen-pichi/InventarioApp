  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const movimientos = await window.api.obtenerTodosMovimientos();
      const tbody = document.getElementById('tablaMovimientos');
  
      if (movimientos.length === 0) {
        const fila = document.createElement('tr');
        fila.innerHTML = `<td colspan="5" class="text-center">No hay movimientos registrados.</td>`;
        tbody.appendChild(fila);
        return;
      }
  
      for (const mov of movimientos) {
        const producto = await window.api.obtenerProductoPorId(mov.id_producto);
  
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${mov.id}</td>
          <td>${mov.nombre_producto || 'Desconocido'}</td>
          <td>${mov.tipo === 'entrada' ? 'Entrada' : 'Salida'}</td>
          <td>${mov.cantidad}</td>
          <td>${formatearFechaHora(mov.fecha)}</td>
        `;
        
        tbody.appendChild(fila);
      }
  
    } catch (error) {
      console.error("Error al cargar movimientos:", error.message);
    }
  });
  
  function formatearFechaHora(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
  
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const segundos = String(fecha.getSeconds()).padStart(2, '0');
  
    return `${dia}/${mes}/${año}, ${horas}:${minutos}:${segundos}`;
  }
  
  
  
  