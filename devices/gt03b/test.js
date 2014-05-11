var net = require('net');
var deviceConfig = require('./config');
var crc16 = require('crc-itu').crc16;

var socket = new net.Socket();
socket.connect(deviceConfig.port);


function getBytes(x, arrayLength) {
  var bytes = [];
  var i = arrayLength;
  do {
    bytes[--i] = x & (255);
    x = x >> 8;
  } while (i);
  return bytes;
}

function posToBuf(pos) { // pos ~ 55.8203761
  return getBytes(parseInt(pos * 60 * 30000), 4);// buffer ~ [05,FD,27,05]
}


var sender = function () {
  var lat = Math.random() * 0.3 + 55.6;
  var lng = Math.random() * 0.4 + 37.4;
  var sendArray = [];
  sendArray = sendArray.concat([0x25, 0x16, 0x0e, 0x05, 0x0a, 0x15, 0x19, 0x33, 0xfd]);
  sendArray = sendArray.concat(posToBuf(lat));
  sendArray = sendArray.concat(posToBuf(lng));
  sendArray = sendArray.concat([0x00, 0x14, 0x00, 0x09, 0x00, 0xfd, 0x01, 0x06, 0x42, 0x00, 0x0c, 0x54, 0x49, 0x04, 0x04, 0x00, 0x01, 0x00, 0x08]);

  var errorCheck = crc16(new Buffer(sendArray));
  var errorCheckBytes = getBytes(errorCheck, 2);

  sendArray = [0x78, 0x78].concat(sendArray);
  sendArray = sendArray.concat(errorCheckBytes);
  sendArray = sendArray.concat([0x0d, 0x0a]);
  socket.write(new Buffer(sendArray));
};

var senderf = function () {
  sender();
  setTimeout(senderf, Math.random() * 5000);
};

senderf();