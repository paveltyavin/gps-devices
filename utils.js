var config = require('./config');
var sender = {};
switch (config.connection) {
  case 'dummy':
    sender.write = function () {
    };
    break;
  case 'json-over-tcp':
    var jot = require('json-over-tcp');
    sender = jot.connect({
      port: config.port,
      host: config.host
    });
    break;
  case 'http':
    var http = require('http');
    sender = http.request({
      hostname: config.host,
      method: config.method,
      port: config.port,
      path: config.path,
      headers : {
        'Content-Type': 'application/json'
      }
    });

    break;
  case 'https':
    var https = require('https');
    sender = https.request({
      hostname: config.host,
      method: config.method,
      port: config.port,
      path: config.path,
      headers : {
        'Content-Type': 'application/json'
      }
    });

    break;
  default:
    break;
}

exports.sender = sender;