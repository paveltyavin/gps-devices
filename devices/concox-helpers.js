var getBytes = function (x, arrayLength) { // arguments ~ (14,2)
  var bytes = [];
  var i = arrayLength;
  do {
    bytes[--i] = x & (255);
    x = x >> 8;
  } while (i);
  return bytes; // bytes ~ ( [0, 0x0E] )
};

var posToBuf = function (pos) { // pos ~ 55.8203761
  return getBytes(parseInt(pos * 60 * 30000), 4);// buffer ~ [05,FD,27,05]
};


var bufToPos = function (buffer) { // buffer ~ [05,FD,27,05]
  var pos = buffer[0];
  for (var i = 1; i < buffer.length; i++) {
    pos = pos << 8;
    pos += buffer[i];
  }
  pos /= 30000;
  pos /= 60;
  return pos; // pos ~ 55.8203761
};

var bufToDate = function (buffer) {
  return new Date(
    buffer[0] + 2000,
    buffer[1] - 1,
    buffer[2],
    buffer[3],
    buffer[4],
    buffer[5]
  );
};
var dateToBuf = function (d) {
  return new Buffer([
    d.getFullYear() - 2000,
    d.getMonth() + 1,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ]);
};

var gpsInfoCourseToBuf = function(gpsInfo, course){
  return [0,0];
};

exports.getBytes = getBytes;
exports.posToBuf = posToBuf;
exports.bufToPos = bufToPos;
exports.bufToDate = bufToDate;
exports.dateToBuf = dateToBuf;
exports.gpsInfoCourseToBuf = gpsInfoCourseToBuf;