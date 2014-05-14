var net = require('net');
var crc16 = require('crc-itu').crc16;
var hexy = require("hexy");
var utils = require('./../../utils');
var deviceConfig = require('./config');
var logger = require('./logger');
var concoxHelpers = require('./../concox-helpers');


logger.log('debug', 'START GT03B server');
var hexyFormat = {width: 64, format: 'twos', numbering: 'none', annotate: 'none'};

net.createServer(function (socket) {
  socket.setTimeout(0);
  socket.setEncoding("utf8");
  socket.addListener('data', function (data) {
    var buffer = new Buffer(data, 'binary');
    logger.info('recieved:', hexy.hexy(buffer, hexyFormat).trim());
    var responseArray = [buffer[3]]; // the fourth byte is the protocol byte
    var date, lng, lat;
    switch (buffer[3]) { // find protocol
      case 0x01: // login
        break;
      case 0x10: //
        date = concoxHelpers.bufToDate(buffer.slice(4, 10));
        lat = concoxHelpers.bufToPos(buffer.slice(11, 15));
        lng = concoxHelpers.bufToPos(buffer.slice(15, 19));
        break;
      case 0x12: //
        break;
      case 0x13: // status heartbeat
        break;
      case 0x16: //
        date = concoxHelpers.bufToDate(buffer.slice(4, 10));
        lat = concoxHelpers.bufToPos(buffer.slice(11, 15));
        lng = concoxHelpers.bufToPos(buffer.slice(15, 19));
        break;
      case 0x18: //
        break;
      case 0x19: // Combined information package of LBS and status
        break;
    }
    responseArray = responseArray.concat([0x00, 0x01]); // server serial number

    var responseLength = responseArray.length + 2; // plus 2 errorBytes
    responseArray = [responseLength].concat(responseArray);  // add length byte

    var errorCheck = crc16(new Buffer(responseArray));
    var errorCheckBytes = concoxHelpers.getBytes(errorCheck, 2);

    responseArray = [0x78, 0x78].concat(responseArray);  // add start bytes
    responseArray = responseArray.concat(errorCheckBytes); // add error bytes
    responseArray = responseArray.concat([0x0D, 0x0A]); // add stop bytes

    var responseBuffer = new Buffer(responseArray);

    logger.info('response:', hexy.hexy(responseBuffer, hexyFormat).trim());

    socket.write(responseBuffer);

    if ((lat) && (lng)) {
      var obj = {
        lat: lat,
        lng: lng
      };
      if (typeof(deviceConfig.id) === 'function') {
        obj.id = deviceConfig.id();
      } else {
        obj.id = parseInt(deviceConfig.id);
      }
      if (date) {
        obj.date = date;
      }
      logger.info('id: ' + obj.id + ' lat, lng, date: ' + lat.toFixed(4) + ' ' + lng.toFixed(4) + ' ' + date);
      utils.sender.write(obj);
    }

  });
  socket.addListener("end", function () {
    logger.log('debug', 'end of connection');
  });
  socket.addListener("error", function (err) {
    logger.log('debug', 'connection error', err.message);
  });
}).listen(deviceConfig.port);
