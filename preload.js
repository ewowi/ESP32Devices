const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Listen for device updates
  onDeviceUpdate: (callback) => {
    ipcRenderer.on('device-update', (event, data) => callback(data));
  },
  
  // Listen for device removals
  onDeviceRemoved: (callback) => {
    ipcRenderer.on('device-removed', (event, deviceId) => callback(deviceId));
  },
  
  // Get all current devices
  getAllDevices: () => ipcRenderer.invoke('get-all-devices')
});