const devicesContainer = document.getElementById('devices-container');
const noDevicesElement = document.getElementById('no-devices');
const deviceCountElement = document.getElementById('device-count');
const lastUpdateElement = document.getElementById('last-update');

const devices = new Map();

// Format time ago
function timeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

// Format timestamp for display
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

// Create or update device card
function updateDeviceCard(deviceId, deviceData) {
    let card = document.getElementById(`device-${deviceId}`);
    
    if (!card) {
        card = document.createElement('div');
        card.className = 'device-card';
        card.id = `device-${deviceId}`;
        devicesContainer.appendChild(card);
    }

    // Determine what fields to show
    const excludeFields = ['id', 'ip', 'port', 'lastSeen'];
    const deviceFields = Object.keys(deviceData)
        .filter(key => !excludeFields.includes(key))
        .map(key => ({
            key,
            value: deviceData[key]
        }));

    const deviceName = deviceData.name || deviceId;
    const status = deviceData.status || 'online';

    card.innerHTML = `
        <div class="device-header">
            <div class="device-title">
                <div class="device-name">${deviceName}</div>
                <div class="device-id">${deviceId}</div>
            </div>
            <div class="device-status ${status}">${status}</div>
        </div>
        <div class="device-info">
            ${deviceFields.map(field => `
                <div class="info-row">
                    <span class="info-label">${field.key}</span>
                    <span class="info-value">${field.value}</span>
                </div>
            `).join('')}
        </div>
        <div class="device-footer">
            <div class="last-seen">Last seen: ${timeAgo(deviceData.lastSeen)}</div>
            <div>IP: ${deviceData.ip}</div>
        </div>
    `;

    // Hide "no devices" message
    noDevicesElement.style.display = 'none';
}

// Remove device card
function removeDeviceCard(deviceId) {
    const card = document.getElementById(`device-${deviceId}`);
    if (card) {
        card.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            card.remove();
            devices.delete(deviceId);
            updateStats();
            
            // Show "no devices" message if no devices left
            if (devices.size === 0) {
                noDevicesElement.style.display = 'block';
            }
        }, 300);
    }
}

// Update statistics
function updateStats() {
    deviceCountElement.textContent = devices.size;
    lastUpdateElement.textContent = formatTimestamp(Date.now());
}

// Update timestamps periodically
function updateTimestamps() {
    devices.forEach((device, deviceId) => {
        const card = document.getElementById(`device-${deviceId}`);
        if (card) {
            const lastSeenElement = card.querySelector('.last-seen');
            if (lastSeenElement) {
                lastSeenElement.textContent = `Last seen: ${timeAgo(device.lastSeen)}`;
            }
        }
    });
}

// Set up event listeners
window.electron.onDeviceUpdate((data) => {
    const { deviceId, device } = data;
    devices.set(deviceId, device);
    updateDeviceCard(deviceId, device);
    updateStats();
});

window.electron.onDeviceRemoved((deviceId) => {
    removeDeviceCard(deviceId);
});

// Load initial devices
window.electron.getAllDevices().then((deviceList) => {
    deviceList.forEach(({ deviceId, device }) => {
        devices.set(deviceId, device);
        updateDeviceCard(deviceId, device);
    });
    updateStats();
});

// Update timestamps every 5 seconds
setInterval(updateTimestamps, 5000);

// Add CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);