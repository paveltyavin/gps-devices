var net = require('net');
var utils = require('./../../utils');
var deviceConfig = require('./config');
var logger = require('./logger');
logger.log('debug', 'START TR102 server');

net.createServer(function (socket) {
  socket.setTimeout(0);
  socket.setEncoding("utf8");
  socket.addListener('data', function (message) {
    // message is like "$355632002562503,1,3,160414,221427,E03737.3756,N5539.3943,166.2,0.1,91.04,05*37!"

    var re = /\$\d{15},.*,\w(\d{3})(\d{2})\.(\d{4}),\w(\d{2})(\d{2})\.(\d{4}),.*!/;
    var res = re.exec(message);
    if (!res) {
      return null;
    }
    var obj = {};
    obj.lng = parseInt(res[1]) + (parseInt(res[2]) + parseInt(res[3]) * 1e-4) / 60;
    obj.lat = parseInt(res[4]) + (parseInt(res[5]) + parseInt(res[6]) * 1e-4) / 60;
    if (typeof(deviceConfig.id) === 'function'){
      obj.id = deviceConfig.id(message);
    } else {
      obj.id = parseInt(deviceConfig.id);
    }
    logger.info(message);
    logger.info(obj.id + ' ' + obj.lat.toFixed(4) + ' ' +  obj.lng.toFixed(4));
    utils.sender.write(obj);
    return null;
  });
}).listen(deviceConfig.port);
