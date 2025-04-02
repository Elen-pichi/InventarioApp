document.addEventListener('DOMContentLoaded', async () => {
    const usuario = await window.api.obtenerUsuarioActual();
    if (!usuario || usuario.rol !== 'admin') {
      document.querySelectorAll('.solo-admin').forEach(el => el.style.display = 'none');
    }
  
    await cargarUsuarios();
  });
  
  window.api.onUsuariosUpdated(async () => {
    await cargarUsuarios();
  });
  
  async function cargarUsuarios() {
    const lista = await window.api.obtenerTodosUsuarios();
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = '';
  
    lista.forEach(usuario => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td id="nombre-${usuario.id}">${usuario.nombre}</td>
        <td id="usuario-${usuario.id}">${usuario.usuario}</td>
        <td id="rol-${usuario.id}">${usuario.rol}</td>
        <td class="solo-admin">
          <button class="btn btn-warning btn-sm py-0 me-2" onclick="editarUsuario(${usuario.id})"><i class="fa-solid fa-pencil"></i></button>
          <button class="btn btn-danger btn-sm py-0" onclick="eliminarUsuario(${usuario.id}, '${usuario.usuario}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }
  
  function cancelarCreacion() {
    document.getElementById('nuevoNombre').value = '';
    document.getElementById('nuevoUsuario').value = '';
    document.getElementById('nuevoRol').value = 'usuario';
    document.getElementById('nuevaContrasena').value = '';
  }
  
  async function crearUsuario() {
    const nombre = document.getElementById('nuevoNombre').value.trim();
    const usuario = document.getElementById('nuevoUsuario').value.trim();
    const rol = document.getElementById('nuevoRol').value;
    const contraseña = document.getElementById('nuevaContrasena').value;
  
    if (!nombre || !usuario || !contraseña) {
      alert("Todos los campos son obligatorios.");
      return;
    }
  
    await window.api.crearUsuario({ nombre, usuario, rol, contraseña });
    cancelarCreacion();
    await cargarUsuarios();
    window.api.enviarEvento?.('usuarios-updated');
  }
  
  function editarUsuario(id) {
    const nombreTd = document.getElementById(`nombre-${id}`);
    const usuarioTd = document.getElementById(`usuario-${id}`);
    const rolTd = document.getElementById(`rol-${id}`);
  
    const nombreActual = nombreTd.textContent;
    const usuarioActual = usuarioTd.textContent;
    const rolActual = rolTd.textContent;
  
    nombreTd.innerHTML = `<input type="text" id="input-nombre-${id}" class="form-control" value="${nombreActual}">`;
    usuarioTd.innerHTML = `<input type="text" id="input-usuario-${id}" class="form-control" value="${usuarioActual}">`;
    rolTd.innerHTML = `
      <select id="input-rol-${id}" class="form-select">
        <option value="admin" ${rolActual === 'admin' ? 'selected' : ''}>admin</option>
        <option value="usuario" ${rolActual === 'usuario' ? 'selected' : ''}>usuario</option>
      </select>
    `;
  
    const fila = nombreTd.parentElement;
    fila.querySelector('td:last-child').innerHTML = `
      <input type="password" id="input-pass-${id}" class="form-control mb-1" placeholder="Nueva contraseña (opcional)">
      <button class="btn btn-primary btn-sm me-2 py-0" onclick="guardarEdicion(${id})">Guardar</button>
      <button class="btn btn-secondary btn-sm py-0" onclick="cancelarEdicion()">Cancelar</button>
    `;
  }
  
  async function guardarEdicion(id) {
    const nombre = document.getElementById(`input-nombre-${id}`).value.trim();
    const usuario = document.getElementById(`input-usuario-${id}`).value.trim();
    const rol = document.getElementById(`input-rol-${id}`).value;
    const contraseña = document.getElementById(`input-pass-${id}`).value.trim();
  
    if (!nombre || !usuario) return alert('Nombre y usuario no pueden estar vacíos');
  
    await window.api.editarUsuario({ id, nombre, usuario, rol, contraseña: contraseña || null });
    await cargarUsuarios();
    window.api.enviarEvento?.('usuarios-updated');
  }
  
  async function eliminarUsuario(id, usuario) {
    if (confirm(`¿Eliminar usuario "${usuario}"?`)) {
      await window.api.eliminarUsuario(id);
      await cargarUsuarios();
      window.api.enviarEvento?.('usuarios-updated');
    }
  }
  
  function cancelarEdicion() {
    cargarUsuarios();
  }
  
  
  
  