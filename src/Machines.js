'use strict';

var Device = require('./Device')
  , serialport = require('serialport')
  , inherits = require('util').inherits
  , diff = require('./flat-diff')
  , spm = require('./spm')
  , _ = require('lodash')
  , EventEmitter = require('events').EventEmitter;

/**
 * Describes the conjunction of machines to
 * search for.
 *
 * emits:
 *  - removeddevice,
 *  - device,
 *  - invaliddevice,
 *  - validdevice.
 *
 * @param {string} sigTerm signature string to
 * match.
 */
function Machines (sigTerm) {
  if (!(this instanceof Machines))
    return new Machines(sigTerm);

  this._sigTerm = sigTerm;
  this._devices = {};

  EventEmitter.call(this);
}

inherits(Machines, EventEmitter);

/**
 * Searches for valid devices that are connected
 * @param  {Function} onDeviceFound
 * callback function to be resolved with
 * (err|Device) when a valid device is found
 */
Machines.prototype.search = function (time) {
  var scope = this;
  time = time || 500;

  setTimeout(function () {
    serialport.list(function (err, ports) {
      var diffs = diff(_.pluck(scope._devices, 'pnpId'),
                       _.pluck(ports, 'pnpId'));

      diffs.insertions.forEach(function (pnpId) {
        var dev = _.find(ports, function (elem) {
          return elem.pnpId === pnpId;
        });

        scope._process(dev, !!scope._sigTerm);
      });

      diffs.deletions.forEach(function (pnpId) {
        delete scope._devices[pnpId];

        scope.emit('removeddevice', pnpId);
      });
    });

    scope.search();
  }, time);

  return this;
};

/**
 * Processes the sigTerm
 * @param  {Device} dev
 */
Machines.prototype._process = function (dev, checkSignature) {
  var scope = this;

  spm(dev.comName, checkSignature, function (e, sp, sig) {
    var device;

    dev.signature = sig;
    device = new Device(dev, sp);

    scope._devices[dev.pnpId] = device;
    scope.emit('device', device);

    if (!sig)
      return;

    if (scope.isValidDevice(device))
      scope.emit('validdevice', device);
    else
      scope.emit('invaliddevice', device);
  });
};

/**
 * Verifies if the device passed to it is valid
 * (given a signature).
 * @param  {obj}  device info about the device
 * @return {bool}
 */
Machines.prototype.isValidDevice = function (device) {
  var info = device.getInfo();

  return (!(info && ~info.signature.toLowerCase().indexOf(this._sigTerm)))
      ? false
      : true;
};


module.exports = Machines;
