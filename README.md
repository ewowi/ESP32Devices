# ESP32Devices

NodeJS tool to find ESP32 devices on the network listening to UDP. Supports [WLED](https://github.com/wled/WLED), [WLED-MM](https://github.com/MoonModules/WLED-MM), [MoonBase](https://github.com/ewowi/MoonBase) and [MoonLight](https://github.com/MoonModules/MoonLight)

<img width="908" alt="Screenshot 2025-04-15 at 22 34 17" src="https://github.com/user-attachments/assets/a8cdf33e-2e83-4662-a0e3-778dded1fcd7" />

ESP32Devices is a [MoonModules](http://MoonModules.org) product, ⚖️GPL-v3

# InstallRun

* Clone this repo to folder xyz (choose your place)
* ```cd xyz```
* install nodeJS if not installed already
* ```npm init -y``` to create package.json
* ```npm install ws``` to enable websockets

# Run

* ```node ESP32Devices.js``` to start a webserver listening to udp 65506 and hosting html on 8192. 65506 is used by WLED and Moon. 8192 can be changed if you prefer another port.
* ```index.html``` to start the webpage showing the devices. Click on the IP number to go to the Device itself

# Remarks

* Idea -> AI -> First commit
* This tool can easily be extended with a little knowledge of HTML / JS
    * More WLED UPD data can be extracted according to the [instance package definition](https://github.com/MoonModules/StarLight/blob/cc909d1663f3d775e0bc1ed0a4b5678889a34814/src/Sys/SysModInstances.h#L55-L66) and [sync package definition](https://github.com/MoonModules/StarLight/blob/cc909d1663f3d775e0bc1ed0a4b5678889a34814/src/Sys/SysModInstances.h#L76-L99) (UDP on port 21324)
    * More info can be extracted using the JSON get api of wled (e.g. <ip>/cfg etc). Commands can be send to WLED devices using JSON post
    * This is developed in parallel with [moonlight/devices](https://moonmodules.org/MoonLight/moonbase/module/devices/) as this module will ask devices: what do you want me to control for you.

  <img width="696" alt="image" src="https://github.com/user-attachments/assets/50b4cb41-1deb-482a-89d1-3e787b9276b9" />


* Might also implement [Bluetooth support](https://github.com/MoonModules/MoonLight/issues/26)
