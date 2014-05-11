# GPS device translator server

Though there are standards like NMEA 0183, every gps device has unique protocol to send data.

This project aims to understand many protocols and send messages forward in JSON format.

To visualize data from gps devices on map there is another project here: https://github.com/vinograd19/gps-web-tracker

# How does it work

```                                                        ┌-----------------------┐
┌-----------------┐   Complicated Chinese protocol         |                       |      {id:1, lat:20, lng:30}
|Device #1 (gt03b)| <------------------------------------> |                       | -------------------------------->
└-----------------┘                                        |   Translator server   |
                                                           |                       |
┌-----------------┐    Simple NMEA 0183 Message streaming  | * Parses data         |       {id:2, lat:8, lng:30}
|Device #2 (tr102)| -------------------------------------> | * Understands many    | -------------------------------->
└-----------------┘                                        |   protocols           |
                                                           | * Forwards JSON data  |
┌------------------------┐    Another chinese protocol     |   through TCP.        | {id:2, battery:20, lat:50, lng:2}
|Device #3 (xexun tk-102)| <-----------------------------> |                       | -------------------------------->
└------------------------┘                                 └-----------------------┘

```

# Installation

* Clone this git repository on your server
* Create config.js files from config.example.js.
