document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const mensajeError = document.getElementById('mensajeError');
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const usuario = document.getElementById('usuario').value.trim();
      const contrasena = document.getElementById('contrasena').value;
  
      try {
        const datos = await window.api.login(usuario, contrasena);
  
        if (!datos || !datos.rol) {
          mensajeError.textContent = 'Credenciales inválidas.';
          return;
        }
  
        // login exitoso
        await window.api.abrirVentana('index');
       window.close();
       
      } catch (error) {
        mensajeError.textContent = error.message || 'Error al iniciar sesión.';
      }
    });
  
    // lógica del botón ojito
    const togglePasswordBtn = document.getElementById('togglePassword');
    const contrasenaInput = document.getElementById('contrasena');
    const iconoPassword = document.getElementById('iconoPassword');
  
    if (togglePasswordBtn && contrasenaInput && iconoPassword) {
      togglePasswordBtn.addEventListener('click', () => {
        const tipo = contrasenaInput.getAttribute('type') === 'password' ? 'text' : 'password';
        contrasenaInput.setAttribute('type', tipo);
  
        iconoPassword.classList.toggle('fa-eye');
        iconoPassword.classList.toggle('fa-eye-slash');
      });
    }
  });
  