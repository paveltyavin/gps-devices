var net = require('net');
var config = require('./config');
var logger = require('./logger');

var socket = new net.Socket();
socket.connect(config.port);

var sender = function () {
  var lat = Math.random() * 0.3 + 55.6;
  var lng = Math.random() * 0.4 + 37.4;
  var message =  lat.toFixed(4) + ',' + lng.toFixed(4);
  logger.log('debug', message);
  socket.write(message);
};
// send message every 5-10 seconds.
var senderf = function () {
  sender();
  setTimeout(senderf, Math.random() * 5000+5000);
};

senderf();