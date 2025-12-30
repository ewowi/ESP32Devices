# ESP32Devices

Electron App running on MacOS and Windows using NodeJS to find ESP32 devices on the network listening to UDP. Supports [WLED](https://github.com/wled/WLED), [WLED-MM](https://github.com/MoonModules/WLED-MM), [MoonBase](https://github.com/ewowi/MoonBase) and [MoonLight](https://github.com/MoonModules/MoonLight)

<img width="600" src="https://github.com/user-attachments/assets/118324d8-45a6-4a88-b68b-48be3b9709f3" />

ESP32Devices is a [MoonModules](http://MoonModules.org) product, ⚖️GPL-v3

# ESP32 Devices - Electron App

## Project Structure
```
esp32-monitor/
├── package.json
├── main.js
├── preload.js
├── renderer.js
├── index.html
├── web.html
├── web-renderer.js
└── styles.css
```

## Installation Steps

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/ (LTS version recommended)
   - Windows: install npm first

2. **Create project folder**
   ```bash
   mkdir /GitHub/ewowi/esp32Devices
   cd esp32Devices
   ```

3. **Initialize npm and install dependencies**
   ```bash
   ; npm init -y
   npm install electron express ws --save-dev
   ```

4. **Create the app**
   ```bash
   ; rm -rf node_modules dist ; optionally to clean up
   ; npm install ; not needed ...
   npm run build
   ```

   a distrubutions are created in the esp32Devices/dist folder

6. **Run the app**

   Check the esp32Devices/dist folder for the created executable / installer and click on it

   Check [Releases](https://github.com/ewowi/ESP32Devices/releases) for latest distributions

## 📱 Mobile Access 

Not implemented yet ! 🚧

When the app is running:
1. Click the "📱 Mobile Access" button in the desktop app
2. Scan the QR code with your phone, OR
3. Type one of the displayed URLs in your mobile browser
4. Your phone must be on the same WiFi network

Example mobile URL: `http://192.168.1.100:8080`

The web interface will automatically reconnect if disconnected and works great on phones/tablets!

6. **Build installers** (optional, for distribution)
   ```bash
   npm install electron-builder --save-dev
   npm run build
   ```

## ESP32 Configuration

🚧: update for MoonLight protocol (byte array)

Your ESP32 devices should broadcast UDP packets to port **12345** with JSON format:

```cpp
#include <WiFi.h>
#include <WiFiUdp.h>

WiFiUDP udp;
const char* udpAddress = "255.255.255.255";
const int udpPort = 12345;

void setup() {
  WiFi.begin("YOUR_SSID", "YOUR_PASSWORD");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  udp.begin(udpPort);
}

void loop() {
  // Create JSON packet
  String json = "{\"id\":\"ESP32_01\",\"name\":\"Living Room Sensor\",";
  json += "\"temperature\":23.5,\"humidity\":65,\"status\":\"ok\"}";
  
  // Broadcast
  udp.beginPacket(udpAddress, udpPort);
  udp.print(json);
  udp.endPacket();
  
  delay(5000); // Send every 5 seconds
}
```

## Expected JSON Format

```json
{
  "id": "ESP32_01",
  "name": "Device Name",
  "temperature": 23.5,
  "humidity": 65,
  "status": "ok"
}
```

You can add any fields you want - the app will display them all.

# Remarks

* Idea -> AI -> First commit
* This tool can easily be extended with a little knowledge of HTML / JS
    * More WLED UPD data can be extracted according to the [instance package definition](https://github.com/MoonModules/StarLight/blob/cc909d1663f3d775e0bc1ed0a4b5678889a34814/src/Sys/SysModInstances.h#L55-L66) and [sync package definition](https://github.com/MoonModules/StarLight/blob/cc909d1663f3d775e0bc1ed0a4b5678889a34814/src/Sys/SysModInstances.h#L76-L99) (UDP on port 21324)
    * More info can be extracted using the JSON get api of wled (e.g. <ip>/cfg etc). Commands can be send to WLED devices using JSON post
    * This is developed in parallel with [moonlight/devices](https://moonmodules.org/MoonLight/moonbase/devices/) as this module will ask devices: what do you want me to control for you.

  <img width="393" height="575" src="https://github.com/user-attachments/assets/b1de393a-d887-4b1d-b237-65f250ead279" />

* Might also implement [Bluetooth support](https://github.com/MoonModules/MoonLight/issues/26)
