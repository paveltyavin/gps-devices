var net = require('net');
var serverConfig = require('./../../config');
var deviceConfig = require('./config');
var jot = require('json-over-tcp');
var logger = require('./logger');

var client = jot.connect({port:serverConfig.port, host:serverConfig.host});
logger.log('debug', 'START GP200X server');

net.createServer(function (socket) {
  socket.setTimeout(0);
  socket.setEncoding("utf8");
  socket.addListener('data', function (message) {
    logger.info(message);
    // message is like "$GPRMC,162017.000,A,5551.5039,N,03740.0065,E,0.00,,040912,0,,A*75+79123456789#"
    var re = /\$GPRMC,.*,A,(\d{2})(\d{2})\.(\d{4}),N,0(\d{2})(\d{2})\.(\d{4}),E.*#/;
    var res = re.exec(message);
    if (!res) {
      return null;
    }
    var obj = {};
    obj.lat = parseInt(res[1]) + (parseInt(res[2]) + parseInt(res[3]) * 1e-4) / 60;
    obj.lng = parseInt(res[4]) + (parseInt(res[5]) + parseInt(res[6]) * 1e-4) / 60;
    obj.id = deviceConfig.getId(message);
    client.write(obj);
    return null;
  });
}).listen(deviceConfig.port);
