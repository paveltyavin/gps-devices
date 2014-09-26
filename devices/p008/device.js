var net = require('net');
var config = require('./config');
var crc16 = require('crc-itu').crc16;
var concoxHelpers = require('./../concox-helpers');
var logger = require('./logger');

var socket = new net.Socket();
socket.connect(config.port);


var idToBuf = function(){
  return [0,0,0,0,0,0,1];
};

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

  sendArray = sendArray.concat([0x00, 0x24]); // protocol number
  sendArray = sendArray.concat(idToBuf()); // 7 bytes
  sendArray = sendArray.concat([0,0,0,0,0,0,0,0,0]);// 9 bytes
  sendArray = sendArray.concat([0x30,0x30,0x30,0x2c]);// 4 bytes
  sendArray = sendArray.concat([0x56,0x2c]);// 2 bytes
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

  sendArray = [0x24, 0x24].concat(sendArray);
  sendArray = sendArray.concat(errorCheckBytes);
  sendArray = sendArray.concat([0x0d, 0x0a]);

  return new Buffer(sendArray);
};

//165639.000,V,5551.46149,N,03739.84923,E,,,300814,,|99.99||26416,7734,02,250|0000|00|100|100�(
var send = function(){
  var s =
    '24 24 ' +
    '0 6c ' + // protocol number
    '23 74 13 26 78 43 43 ' + // id
    'fd 55 31 36 35 36 33 39 2e ' +
    '30 30 30 2c ' + //000,
    '56 2c ' + //V,
    '35 35 35 31 2e 34 36 31 34 39 2c ' + //5551.46149,
    '4e 2c ' + //N,
    '30 33 37 33 39 2e 38 34 39 32 33 2c ' + //03739.84923,
    '45 2c 2c 2c ' + //E,,,
    '33 30 30 38 31 34 2c 2c ' +
    '7c 39 39 2e 39 39 7c 7c 32 36 34 31 36 2c ' +
    '37 37 33 34 2c ' +
    '30 32 2c ' +
    '32 35 30 7c 30 30 30 30 7c 30 30 7c 31 30 30 7c 31 30 30 fd 28 ' +
    'd a';
  return s;
}

var sender = function () {
//  var buffer = send16();
  var buffer = send();
  socket.write(buffer);
};

var senderf = function () {
  sender();
  setTimeout(senderf, Math.random() * 5000);
};

senderf();