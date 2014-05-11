var net = require('net');
var crc16 = require('crc-itu').crc16;
var hexy = require("hexy");
var jot = require("json-over-tcp");
var serverConfig = require('./../../config');
var deviceConfig = require('./config');
var logger = require('./logger');

function getBytes(x) {
  var bytes = [];
  var i = 2;
  do {
    bytes[--i] = x & (255);
    x = x >> 8;
  } while (x);
  return bytes;
}

function bufToPos(buffer) { // buffer ~ [05,FD,27,05]
  var pos = buffer[0];
  for (var i = 1; i < buffer.length; i++) {
    pos = pos << 8;
    pos += buffer[i];
  }
  pos /= 30000;
  pos /= 60;
  return pos; // pos ~ 55.8203761

}

function bufToDate(buffer) {
  return new Date(
    buffer[0] + 2000,
    buffer[1] - 1,
    buffer[2],
    buffer[3],
    buffer[4],
    buffer[5]
  );
}


var client = jot.connect(serverConfig.devicePort);

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
        date = bufToDate(buffer.slice(4, 10));
        lat = bufToPos(buffer.slice(11, 15));
        lng = bufToPos(buffer.slice(15, 19));
        break;
      case 0x12: //
        break;
      case 0x13: // status heartbeat
        break;
      case 0x16: //
        date = bufToDate(buffer.slice(4, 10));
        lat = bufToPos(buffer.slice(11, 15));
        lng = bufToPos(buffer.slice(15, 19));
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
    var errorCheckBytes = getBytes(errorCheck);

    responseArray = [0x78, 0x78].concat(responseArray);  // add start bytes
    responseArray = responseArray.concat(errorCheckBytes); // add error bytes
    responseArray = responseArray.concat([0x0D, 0x0A]); // add stop bytes

    var responseBuffer = new Buffer(responseArray);

    logger.info('response:', hexy.hexy(responseBuffer, hexyFormat).trim());

    socket.write(responseBuffer);

    if ((lat) && (lng)) {
      logger.info('lat, lng', lat, lng);
      var obj = {
        lat: lat,
        lng: lng,
        id: deviceConfig.id
      };
      if (date){
        obj.date = date;
      }
      client.write(obj);
    }

  });
  socket.addListener("end", function () {
    logger.log('debug', 'end of connection');
  });
  socket.addListener("error", function (err) {
    logger.log('debug', 'connection error', err.message);
  });
}).listen(deviceConfig.port);
