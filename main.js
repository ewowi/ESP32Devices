const { app, BrowserWindow, ipcMain } = require('electron');
const dgram = require('dgram');
const path = require('path');

let mainWindow;
let udpSocket;
const devices = new Map();
const UDP_PORT = 65506;
const DEVICE_TIMEOUT = 30000; // 30 seconds

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');

    // Open DevTools in development
    // mainWindow.webContents.openDevTools();
}

function startUdpListener() {
    udpSocket = dgram.createSocket('udp4');

    udpSocket.on('error', (err) => {
        console.error('UDP Socket error:', err);
    });

    udpSocket.on('message', (msg, rinfo) => {
        try {
            // const data = `Ping from ${msg.toString().substring(6, 32)} @ <a href="http://${rinfo.address}" target="_blank">${rinfo.address}</a> (port:${rinfo.port})`;
            // console.log(data);

            const str = msg.toString("utf8").substring(6, 32);
            const id = str.split("\u0000")[0];

            const data = JSON.parse(`
                {
                    "id": "${id}",
                    "name": "${id}",
                    "whatever": "..."
                }
            `);

            // Add metadata
            const deviceInfo = {
                ...data,
                ip: rinfo.address,
                port: rinfo.port,
                lastSeen: Date.now()
            };

            // Store or update device
            const deviceId = data.id || rinfo.address;
            devices.set(deviceId, deviceInfo);

            // Send to renderer
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('device-update', {
                    deviceId,
                    device: deviceInfo
                });
            }
        } catch (error) {
            console.error('Error parsing UDP message:', error);
        }
    });

    udpSocket.on('listening', () => {
        const address = udpSocket.address();
        console.log(`UDP Server listening on ${address.address}:${address.port}`);
    });

    udpSocket.bind(UDP_PORT);
}

function checkDeviceTimeouts() {
    const now = Date.now();
    const timeoutDevices = [];

    devices.forEach((device, deviceId) => {
        if (now - device.lastSeen > DEVICE_TIMEOUT) {
            timeoutDevices.push(deviceId);
        }
    });

    timeoutDevices.forEach(deviceId => {
        devices.delete(deviceId);
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('device-removed', deviceId);
        }
    });
}

// Check for timeouts every 5 seconds
setInterval(checkDeviceTimeouts, 5000);

// IPC handlers
ipcMain.handle('get-all-devices', () => {
    return Array.from(devices.entries()).map(([id, device]) => ({
        deviceId: id,
        device
    }));
});

app.whenReady().then(() => {
    createWindow();
    startUdpListener();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (udpSocket) {
        udpSocket.close();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    if (udpSocket) {
        udpSocket.close();
    }
});