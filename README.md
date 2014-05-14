# GPS device translator server

Though there are standards like NMEA 0183, every gps device has unique protocol to send data.

This project aims to understand many protocols and send forward JSON-data by tcp, http or https.

An example of project which visualizes data from gps devices on map can be found
[here](https://github.com/vinograd19/gps-web-tracker)


# How does it work

```
┌─────────────────┐   ┌─────────────────┐   ┌────────────────────────┐
│Device #1 (gt03b)│   │Device #2 (tr102)│   │Device #3 (xexun tk-102)│
└─────────────────┘   └───────┬─────────┘   └────────────────────────┘
        ↑                     │                        ↑
┌───────┴─────────┐   ┌───────┴─────────┐   ┌──────────┴─────────────┐
│  Complicated    │   │ Simple NMEA 0183│   │        Another         │
│chinese protocol │   │    protocol     │   │    chinese protocol    │
└───────┬─────────┘   └───────┬─────────┘   └──────────┬─────────────┘
        ↓                     ↓                        ↓
┌────────────────────────────────────────────────────────────────────┐
│                       Translator server                            │
│                                                                    │
│       * Understands protocol for every device                      │
│       * Parses data                                                │
│       * Forwards JSON data through TCP, HTTP or HTTPS              │
│                                                                    │
└───────┬─────────────────────┬────────────────────────┬─────────────┘
        │                     │                        │
  ┌─────┴─────┐         ┌─────┴─────┐          ┌───────┴──────┐
  │ {         │         │ {         │          │ {            │
  │   id:1,   │         │   id:2,   │          │   id:3       │
  │   lat:20, │         │   lat:35, │          │   lat:60,    │
  │   lng:20  │         │   lng:45  │          │   lng:30,    │
  │ }         │         │ }         │          │   battery:20 │
  └─────┬─────┘         └─────┬─────┘          │ }            │
        │                     │                └───────┬──────┘
        ↓                     ↓                        ↓

```

# Installation

* Clone this git repository on your server
* Install node. Execute `npm install`.
* Create ./config.js file from ./config.example.js. and specify destination host and port.

# Usage

Imagine you want to listen to gt03b device.

* Setup your device according to your instructions.
* Write port in ./devices/gt03b/config.js like `exports.port = 9103;`
* Run a process `node ./devices/gt03b/server.js`.
* While your device sends data, watch the log in console or file.
* If you don't have a device and you want to test server, you can run another process `./devices/gt03b/device.js`. This
process will imitate device.
* Watch the log on destination server.

# Schema

Aside of gps info, many trackers send additional info like battery indication , speed, course, etc.
For all parameters, there is a schema [here](https://github.com/vinograd19/gps-devices/blob/master/schema.json)

# Protocol

There are several protocols to send output.

* JSON over tcp. This protocol described [here](https://github.com/turn/json-over-tcp).
Define `port` and `host` in config file.
* HTTP/HTTPS. Requests are sent with `content-type:application/json` header.
Define `port` (default is 80 for http and 443 for https), `host`, `path`, `method`,  in config file.
* Dummy. Translator doesn't send anything. Use this just for tests.

# Similar projects

[Traccar](https://github.com/tananaev/traccar) (JAVA)