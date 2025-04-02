// asegurar que el script solo se ejecuta en el proceso de renderizado
if (typeof window === 'undefined') {
    console.error("Error: rendererCrearProducto.js solo debe ejecutarse en el proceso de renderizado.");
    throw new Error("rendererCrearProducto.js solo debe ejecutarse en el proceso de renderizado.");
}

// capturar el evento de envío del formulario
document.getElementById("form-crear-proveedor")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // recogemos los valores del formulario
    const proveedor = {
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        contacto: document.getElementById('contacto').value,
    };
    try {
        console.log("Enviando nuevo proveedor a la base de datos...", proveedor);       
        await window.api.crearProveedor(proveedor);
        console.log("Proveedor creado con éxito.");
        window.close();
    } catch (error) {
        console.error("Error al crear el proveedor en rendererCrearProveedor.js:", error.message);
    }
});


