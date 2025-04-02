//archivo que maneja el inicio y creación de la página principal
//carga ipcHandlers.js para registrar la comunicación IPC
//crea la ventana principal (index.html) con nodeIntegration activado
//cierra la aplicación correctamente en Linux/Windows y para asegurar que se cierra bien en macOS añado app.on('activate')
//contexIsolation a false, permite que el proceso de renderizado (la ventana) tenga acceso directo al proceso principal y a los módulos de node.js dentro del window global. A true separa el contexto de ejecución ui y el backend mejorando la seguridad.

const { app, BrowserWindow, ipcMain } = require('electron');
const rutas = require('./rutas'); // se importan las rutas globales
const registrarIPCHandlers = require('./ipcHandlers'); // importamos todos los eventos IPC
registrarIPCHandlers(); // llamamos al método de ipcHandlers para conectar los IPC

let ventanaPrincipal;
let ventanas = {}; // objeto para manejar selección de ventanas

// crear la ventana principal
function crearVentanaPrincipal() {
    ventanaPrincipal = new BrowserWindow({
        width: 1000,
        height: 800,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: rutas.PRELOAD_PATH,
        }
    });
    //ventanaLogin.webContents.openDevTools(); // temporal para ver errores
    ventanaPrincipal.loadFile(rutas.INDEX_HTML);
    ventanaPrincipal.on('closed', () => ventanaPrincipal = null);
}

function crearVentanaLogin() {
    const ventanaLogin = new BrowserWindow({
        width: 400,
        height: 500,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: rutas.PRELOAD_PATH,
          
        }
    });
    
    ventanaLogin.loadFile(rutas.LOGIN_HTML);
    ventanaLogin.setMenuBarVisibility(false); // ocultar menú
    ventanaLogin.on('closed', () => {
    });
}



// función para abrir ventanas
function abrirVentana(nombre, datos = null) {
    //verificar si ya existe esa ventana abierta, si es afirmativo la trae al frente sino, la abre
    if (ventanas[nombre]) {
        ventanas[nombre].focus();
        return;
    }
    // opciones de configuración comunes al todas las ventanas
    const opciones = {
        parent: ventanaPrincipal,
        autoHideMenuBar: true,
        webPreferences: {
            preload: rutas.PRELOAD_PATH,
            contextIsolation: true,
            
        }
    };

    // mapa de configuración para las vistas genéricas de cada entidad
    const ventanasSimples = {
        index: { ruta: rutas.INDEX_HTML, width: 1000, height: 800, modal: false },
        productos: { ruta: rutas.PRODUCTOS_HTML, width: 1200, height: 900, modal: false },
        proveedores: { ruta: rutas.PROVEEDORES_HTML, width: 1200, height: 900, modal: false },
        categorias: { ruta: rutas.CATEGORIAS_HTML, width: 600, height: 700, modal: false },
        ubicaciones: { ruta: rutas.UBICACIONES_HTML, width: 1000, height: 500, modal: true },
        movimientos: { ruta: rutas.MOVIMIENTOS_HTML, width: 800, height: 400, modal: true },
        crearEntrada: { ruta: rutas.CREAR_ENTRADA_HTML, width: 1000, height: 900, modal: true },
        crearSalida: { ruta: rutas.CREAR_SALIDA_HTML, width: 1000, height: 900, modal: true },
        usuarios: { ruta: rutas.USUARIOS_HTML, width: 800, height: 700, modal: true },
    };

    // si el nombre coincide con alguna de las ventanasSimples, se crea la ventana y se carga el html correspondiente
    if (ventanasSimples[nombre]) {
        const { ruta, width, height, modal } = ventanasSimples[nombre];
        ventanas[nombre] = new BrowserWindow({ ...opciones, width, height, modal });
        ventanas[nombre].loadFile(ruta);
        //ventanas[nombre].webContents.openDevTools();
        // si el nombre empieza por crear o editar
    } else if (nombre.startsWith('crear') || nombre.startsWith('editar')) {
        // detectar si es crear o editar
        const tipo = nombre.startsWith('crear') ? 'CREAR' : 'EDITAR';
        // busca la palabra crear o editar al principio de la cadena y se sustituye por un valor vacío dejando el resto del string que en este caso es la entidad
        const entidad = nombre.replace(/^crear|^editar/, '');

        // se crea dinámicamente la clave para buscar la ruta del fichero en rutas.js
        const keyRuta = `${tipo}_${entidad.toUpperCase()}_HTML`;
        const rutaVentana = rutas[keyRuta];

        if (!rutaVentana) {
            console.error(`No se encontró la ruta para ${keyRuta}`);
            return;
        }

        // crea la ventana crear/editar, carga el html correspondiente y si es una ventana de editar, envía datos al renderer por IPC para rellenar el formulario usando 'producto-editar'
        ventanas[nombre] = new BrowserWindow({ ...opciones, width: 700, height: 900 });
        ventanas[nombre].loadFile(rutaVentana).then(() => {
            if (tipo === 'EDITAR' && datos) {
                const canal = `${entidad.toLowerCase()}-editar`; // ej: producto-editar
                console.log("Enviando datos al renderer para editar: ", datos);
                ventanas[nombre].webContents.send(canal, datos);
            }
        });

        //ventanas[nombre].webContents.openDevTools();
    } else {
        console.error(`Error: No se reconoce la ventana "${nombre}"`);
        return;
    }

    ventanas[nombre].on('closed', () => {
        ventanas[nombre] = null;
    });
}

// función para recargar una ventana en la que nos encontremos
function recargarVentana(nombre) {
    if (ventanas[nombre]) {
        ventanas[nombre].close();
        delete ventanas[nombre];
    }
    abrirVentana(nombre); // reutiliza la función existente
}


// maneja eventos de apertura de ventanas genéricas
ipcMain.on('abrir-ventana', (_event, nombre) => {
    abrirVentana(nombre);
});

// maneja eventos de apertura de ventanas de edición independientemente de la entidad
ipcMain.on('abrir-ventana-editar', (_event, { tipo, datos }) => {
    // tipo = 'editarProveedor' o 'editarProducto', etc.
    abrirVentana(tipo, datos);
});

ipcMain.on('recargar-ventana', (_event, nombre) => {
    recargarVentana(nombre);
});


//primero se debe habrir la ventana del login
app.whenReady().then(crearVentanaLogin);


// evento para cerrar la aplicación en Linux/Windows y evitar que se cierre en macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// volver a abrir la ventana en macOS al hacer clic en el icono del Dock
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentanaPrincipal();
});

module.exports = { abrirVentana };