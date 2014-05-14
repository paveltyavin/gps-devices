var net = require('net');
var utils = require('./../../utils');
var config = require('./config');
var logger = require('./logger');
logger.log('debug', 'START new device server');

net.createServer(function (socket) {
  socket.setTimeout(0);
  socket.setEncoding("utf8");
  socket.addListener('data', function (message) {
    // message is like "26.7643,43.6578"
    var re = /(\d{2})\.(\d{4}),(\d{2})\.(\d{4})/;
    var res = re.exec(message);
    if (!res) {
      return null;
    }
    var obj = {};
    obj.lng = parseInt(res[1]) + parseInt(res[2]) * 0.001;
    obj.lat = parseInt(res[3]) + parseInt(res[4]) * 0.001;
    if (typeof(config.id) === 'function'){
      obj.id = config.id(message);
    } else {
      obj.id = parseInt(config.id);
    }
    logger.info(message);
    utils.sender.write(obj);
    return null;
  });
}).listen(config.port);
