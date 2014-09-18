'use strict';

var Device = require('./Device');
var serialport = require('serialport');
var spm = require('./spm');

/**
 * Describes the conjunction of machines to
 * search for.
 */
function Machines (sigTerm) {
  this.sigTerm = sigTerm || 'grbl';
}

/**
 * Searches for valid devices that are connected
 * @param  {Function} onDeviceFound
 * callback function to be resolved with
 * (err|Device) when a valid device is found
 */
Machines.prototype.search = function (onDeviceFound) {
  var scope = this;

  serialport.list(function (err, ports) {
    ports.forEach(function (port) {
      var device = {
        info: port
      };

      spm(port.comName, function (e, sp, sig) {
        device.info.signature = sig;

        if (scope.isValidDevice(device))
          onDeviceFound(null, new Device(device.info, sp));
        else
          onDeviceFound(new Error('Not a valid device'));
      });
    });
  });
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
