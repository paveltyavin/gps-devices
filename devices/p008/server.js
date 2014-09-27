var net = require('net');
var crc16 = require('crc-itu').crc16;
var utils = require('./../../utils');
var deviceConfig = require('./config');
var logger = require('./logger');

logger.log('debug', 'START p008 server');

var bufToString = function(buffer){
  var i, res;
  res = '';
  for (i = 0; i < buffer.length; i++) {
    res += buffer[i].toString(16);
  }
  return res;
};
var bufToStringWithSpaces = function(buffer){
  var i, res;
  res = '';
  for (i = 0; i < buffer.length; i++) {
    res += ' '+ buffer[i].toString(16);
  }
  return res;
};

net.createServer(function (socket) {
  socket.setTimeout(0);
  socket.setEncoding("utf8");
  socket.addListener('data', function (data) {
    var buffer = new Buffer(data, 'binary');
    var id = buffer.slice(4, 11);
    var idStr = bufToString(id);

    var message = buffer.slice(13).toString('utf8');
    var latDeg = parseInt(buffer.slice(25, 27).toString('utf8'));
    var latMin = parseFloat(buffer.slice(27, 35).toString('utf8'));

    var lngDeg = parseInt(buffer.slice(38, 41).toString('utf8'));
    var lngMin = parseFloat(buffer.slice(41, 47).toString('utf8'));

    var lat = latDeg + latMin / 60;
    var lng = lngDeg + lngMin / 60;

    logger.info('buffer recieved:', bufToString(buffer));
    logger.info('message recieved:', message);
    logger.info('latDeg:', latDeg);
    logger.info('latMin:', latMin);
    logger.info('lngDeg:', lngDeg);
    logger.info('lngMin:', lngMin);
    logger.info('lat:', lat);
    logger.info('idStr recieved:', idStr);

    if ((lat) && (lng)) {
      var obj = {
        lat: lat,
        lng: lng
      };
      if (typeof(deviceConfig.id) === 'function') {
        obj.id = deviceConfig.id(idStr);
        logger.info('function obj.id:', obj.id);
      } else {
        obj.id = parseInt(deviceConfig.id);
        logger.info('int obj.id:', obj.id);
      }
      logger.info('id: ' + obj.id + ' lat, lng, date: ' + lat.toFixed(4) + ' ' + lng.toFixed(4));
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
