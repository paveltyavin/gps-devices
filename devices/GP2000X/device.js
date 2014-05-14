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
  var message = '$GPRMC,162017.000,A,'
    + Math.floor(lat).toString()
    + Math.floor((lat - Math.floor(lat)) * 60).toString() + '.'
    + paddy(Math.floor((lat - Math.floor(lat)) * 60 * 100), 4).toString() + ',N,0'
    + Math.floor(lng).toString()
    + Math.floor((lng - Math.floor(lng)) * 60).toString() + '.'
    + paddy(Math.floor((lng - Math.floor(lng)) * 60 * 100), 4).toString() +
    ',E,0.00,,040912,0,,A*75+79876543210#';

  socket.write(message);
};

var senderf = function () {
  sender();
  setTimeout(senderf, Math.random() * 5000);
};

senderf();