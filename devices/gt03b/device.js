var net = require('net');
var config = require('./config');
var crc16 = require('crc-itu').crc16;
var concoxHelpers = require('./../concox-helpers');
var logger = require('./logger');

var socket = new net.Socket();
socket.connect(config.port);

var send16 = function(){
  // 0x16 protocol - GPS/LBS/Status Merged Information package

  var lat = Math.random() * 0.3 + 55.6;
  var lng = Math.random() * 0.4 + 37.4;
  var date = new Date;
  var course = parseInt(Math.random()*360);
  var gpsInfo = {
    positioned:(Math.random()-0.5 > 0) // GPS has been positioned
  };
  var speed = parseInt(Math.random()*255);
  var MCC = parseInt(Math.random()*65535); // 2 bytes
  var MNC = parseInt(Math.random()*255); // 1 byte
  var LAC = parseInt(Math.random()*65535); // 2 bytes
  var CellId = parseInt(Math.random()*(256*256*256-1)); // 3 bytes
  var TIC = parseInt(Math.random()*255); // 1 byte
  var VoltageLevel = parseInt(Math.random()*255); // 1 byte
  var GSMSignalStrength = parseInt(Math.random()*255); // 1 byte
  var SerialNumber = parseInt(Math.random()*65535); // 2 bytes

  var sendArray = [];

  sendArray = sendArray.concat([0x16]); // protocol number
  sendArray = sendArray.concat(concoxHelpers.dateToBuf(date)); // 6 bytes
  sendArray = sendArray.concat(concoxHelpers.posToBuf(lat));// 4 bytes
  sendArray = sendArray.concat(concoxHelpers.posToBuf(lng));// 4 bytes
  sendArray = sendArray.concat(concoxHelpers.getBytes(speed, 1));
  sendArray = sendArray.concat(concoxHelpers.gpsInfoCourseToBuf(gpsInfo, course)); // gps positioned and course , 2 bytes
  sendArray = sendArray.concat(concoxHelpers.getBytes(MCC, 2));
  sendArray = sendArray.concat(concoxHelpers.getBytes(MNC, 1));
  sendArray = sendArray.concat(concoxHelpers.getBytes(LAC, 2));
  sendArray = sendArray.concat(concoxHelpers.getBytes(CellId, 3));
  sendArray = sendArray.concat(concoxHelpers.getBytes(TIC, 1));
  sendArray = sendArray.concat(concoxHelpers.getBytes(VoltageLevel, 1));
  sendArray = sendArray.concat(concoxHelpers.getBytes(GSMSignalStrength, 1));
  sendArray = sendArray.concat(concoxHelpers.getBytes(SerialNumber, 2));

  sendArray = [sendArray.length+2].concat(sendArray);

  var errorCheck = crc16(new Buffer(sendArray));
  var errorCheckBytes = concoxHelpers.getBytes(errorCheck, 2);

  sendArray = [0x78, 0x78].concat(sendArray);
  sendArray = sendArray.concat(errorCheckBytes);
  sendArray = sendArray.concat([0x0d, 0x0a]);

  return new Buffer(sendArray);
}

var sender = function () {
  var buffer = send16();
  socket.write(buffer);
};

var senderf = function () {
  sender();
  setTimeout(senderf, Math.random() * 5000);
};

senderf();