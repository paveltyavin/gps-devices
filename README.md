# GPS device translator server

Though there are standards like NMEA 0183, every gps device has unique protocol to send data.

This project aims to understand many protocols and send messages forward in JSON format using
[json-over-tcp](https://github.com/turn/json-over-tcp) protocol.

To visualize data from gps devices on map there is another project here: https://github.com/vinograd19/gps-web-tracker

# How does it work

```

 Device #1 (gt03b)     Device #2 (tr102)     Device #3 (xexun tk-102)
        ↑                     │                        ↑
        │                     │                        │
        │                     │                        │
   Complicated          Simple NMEA 0183            Another
 chinese protocol          protocol             chinese protocol
        │                     │                        │
        ↓                     ↓                        ↓
┌──────────────────────────────────────────────────────────────────┐
│                       Translator server                          │
│                                                                  │
│       * Understands protocol for every device                    │
│       * Parses data                                              │
│       * Forwards JSON data through TCP                           │
│                                                                  │
└───────┬─────────────────────┬────────────────────────┬───────────┘
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
* Create config.js files from config.example.js.
