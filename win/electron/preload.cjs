// Small bridge so the game can talk to the window shell (fullscreen / quit).
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('novaShell', {
  isElectron: true,
  toggleFullscreen: () => ipcRenderer.send('nova:toggle-fullscreen'),
  quit: () => ipcRenderer.send('nova:quit'),
});
