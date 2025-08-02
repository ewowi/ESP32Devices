const dgram = require('dgram');
const WebSocket = require('ws');

const wsPort = 8192
const udpPort = 65506;
const udpServer = dgram.createSocket('udp4');
const wsServer = new WebSocket.Server({ port: wsPort });

let clients = [];

wsServer.on('connection', (ws) => {
    clients.push(ws);
    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
    });
});

udpServer.on('message', (msg, rinfo) => {
    // console.log("xxx", rinfo, msg)
    const data = `Ping from ${msg.toString().substring(6,32)} @ <a href="http://${rinfo.address}" target="_blank">${rinfo.address}</a> (port:${rinfo.port})`;
    console.log(data);

    // Send data to all connected clients
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
});

udpServer.bind(udpPort);
console.log(`WebSocket server running on port`, wsPort);
