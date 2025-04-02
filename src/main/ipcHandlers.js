/* archivo que maneja la comunicación entre el renderer.js (el fontend) con el main.js (el bakend)
a su vez, llama a cada IPC de cada entidad.*/

const registrarIPCProductos = require('./ipc/ipcProductos');
const registrarIPCProveedores = require('./ipc/ipcProveedores');
const registrarIPCCategorias = require('./ipc/ipcCategorias');
const registrarIPCUbicaciones = require('./ipc/ipcUbicaciones');
const registrarIPCMovimientos = require('./ipc/ipcMovimientos');
const registrarIPCUsuarios = require('./ipc/ipcUsuarios');


function registrarIPCHandlers() {
  registrarIPCProductos();
  registrarIPCProveedores();
  registrarIPCCategorias();
  registrarIPCUbicaciones();
  registrarIPCMovimientos();
  registrarIPCUsuarios();
}

module.exports = registrarIPCHandlers;
