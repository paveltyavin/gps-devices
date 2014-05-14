var net = require('net');
var config = require('./config');
var logger = require('./logger');

var socket = new net.Socket();
socket.connect(config.port);

function paddy(n, p) {
  var pad = new Array(1 + p).join('0');
  return (pad + n).slice(-pad.length);
}

var sender = function () {
  var lat = Math.random() * 0.3 + 55.6;
  var lng = Math.random() * 0.4 + 37.4;
  var message = '$355632002562503,1,3,160414,221427,E0'
    + Math.floor(lng).toString()
    + Math.floor((lng - Math.floor(lng)) * 60).toString() + '.'
    + paddy(Math.floor((lng - Math.floor(lng)) * 60 * 100), 4).toString() + ',N'
    + Math.floor(lat).toString()
    + Math.floor((lat - Math.floor(lat)) * 60).toString() + '.'
    + paddy(Math.floor((lat - Math.floor(lat)) * 60 * 100), 4).toString() +
    ',166.2,0.1,91.04,05*37!';

  socket.write(message);
};

var senderf = function () {
  sender();
  setTimeout(senderf, Math.random() * 5000+5000);
};

senderf();