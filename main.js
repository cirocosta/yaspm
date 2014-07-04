var serialPort = require('serialport')
  , split = require('split')
  , spm = require('./spm');

function Device (device, sp) {
  this.info = device;
  this.sp = sp;
  this.open = false;
}

Device.prototype.connect = function(ocb, ccb) {
  var scope = this
    , sp = new serialPort.SerialPort(this.info.comName);

  sp.on('open', function () {
    scope.open = true;
    ocb();
  });

  sp.on('close', function () {
    scope.open = false;
    ccb();
  });

  this.sp = sp;
};

Device.prototype.registerToData = function(cb) {
  if (!this.open) {
    cb(new Error('The device must be connected'));

    return;
  }

  this.sp.pipe(split()).on('data', function (data) {
    cb(null, data);
  });
};

Device.prototype.write = function(what, cb) {
  if (!this.open) {
    cb(new Error('The Device must be connected'));

    return;
  }

  this.sp.write(what, cb);
};

function Machines () {}

Machines.prototype.search = function (onValidDeviceFound) {
  var scope = this;
  serialPort.list(function (err, ports) {
    ports.forEach(function (port) {
      var device = {
        info: port
      };

      spm(port.comName, function (e, sp, sig) {
        device.info.signature = sig;

        if (scope.isValidDevice(device)) {
          onValidDeviceFound(null, new Device(device.info, sp));
        } else {
          onValidDeviceFound(new Error('Not a valid device'));
        }
      });
    });
  });
};

Machines.prototype.isValidDevice = function (device) {
  if (!device.info ||
      !~device.info.signature.toLowerCase().indexOf('grbl'))
    return false;
  return true;
};


module.exports = {
  Device: Device,
  Machines: Machines
};
