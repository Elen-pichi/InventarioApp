// asegurar que el script solo se ejecuta en el proceso de renderizado
if (typeof window === 'undefined') {
    console.error("Error en rendererEditarProveedor.js solo debe ejecutarse en el proceso de renderizado.");
    throw new Error("rendererEditarProveedor.js solo debe ejecutarse en el proceso de renderizado.");    
}

// esperamos a que se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // recibimos los datos del proveedor enviados desde main.js
    window.api.onProveedorEditar((proveedor) => {
        console.log("Estos son los datos del proveedor a editar: ", proveedor);
        // rellenamos el formulario con los datos del proveedor
        document.getElementById('id').value = proveedor.id;
        document.getElementById('nombre').value = proveedor.nombre;
        document.getElementById('direccion').value = proveedor.direccion;
        document.getElementById('email').value = proveedor.email;
        document.getElementById('telefono').value = proveedor.telefono;
        document.getElementById('contacto').value = proveedor.contacto;        
    });

    // escuchamos el envío del formulario
    const formEditar = document.getElementById('form-editar-proveedor');
    formEditar?.addEventListener('submit', async(e) => {
        e.preventDefault();

        const proveedorEditado = {
            id: parseInt(document.getElementById('id').value),
            nombre: document.getElementById('nombre').value,
            direccion: document.getElementById('direccion').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            contacto: document.getElementById('contacto').value,
        };

        try {
            await window.api.editarProveedor(proveedorEditado);
            console.log("Proveedor actualizado exitosamente: ", proveedorEditado);
            window.close(); //cerrar la ventana al finalizar
        } catch (error) {
            console.error("Error al actualizar el proveedor: ", error.message);
        }
    });

});