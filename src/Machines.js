'use strict';

var Device = require('./Device');
var serialport = require('serialport');
var spm = require('./spm');
var EventEmitter = require('events').EventEmitter;

/**
 * Describes the conjunction of machines to
 * search for.
 */
function Machines (sigTerm) {
  if (!(this instance of Machines))
    return new Machines(sigTerm);

  EventEmitter.call(this);

  this.sigTerm = sigTerm || 'grbl';
}

util.inherits(Machines, EventEmitter);

/**
 * Searches for valid devices that are connected
 * @param  {Function} onDeviceFound
 * callback function to be resolved with
 * (err|Device) when a valid device is found
 */
Machines.prototype.search = function () {
  var scope = this;

  serialport.list(function (err, ports) {
    ports.forEach(function (port) {
      var dev = {
        info: port
      };

      spm(port.comName, function (e, sp, sig) {
        dev.info.signature = sig;

        var device = new Device(dev.info, sp);

        scope.emit('device', device);
        if (scope.isValidDevice(device))
          scope.emit('validdevice', device);
        else
          scope.emit('invaliddevice', device);
      });
    });
  });

  return this;
};

/**
 * Verifies if the device passed to it is valid
 * (given a signature).
 * @param  {obj}  device info about the device
 * @return {bool}
 */
Machines.prototype.isValidDevice = function (device) {
  if (!device.info ||
      !~device.info.signature.toLowerCase().indexOf(this.sigTerm))
    return false;

  return true;
};


module.exports = Machines;
