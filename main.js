var serialPort = require('serialport')
  , split = require('split')
  , spm = require('./spm');

/**
 * Represents a valid Device.
 * @param {obj} device the info about the device
 * @param {obj} sp     serialport object
 */
function Device (device, sp) {
  this.info = device;
  this.sp = sp;
  this.open = false;
}

/**
 * Tries to connect to the device.
 * @param  {Function} ocb callback function for
 *                        the open event
 * @param  {Function} ccb callback function for
 *                        the close event
 */
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

/**
 * Sets a listener for the 'data' event of the
 * device.
 * @param  {Function} cb callback function to be
 *                       called with (err|data)
 *                       whenever data|err
 *                       comes.
 */
Device.prototype.registerToData = function(cb) {
  if (!this.open) {
    cb(new Error('The device must be connected'));

    return;
  }

  this.sp.pipe(split()).on('data', function (data) {
    cb(null, data);
  });
};

/**
 * Writes to the device (which must be
 * connected).
 * @param  {string}   what what to be written to
 *                         it
 * @param  {Function} cb   callback to the write
 *                         operation
 */
Device.prototype.write = function(what, cb) {
  if (!this.open) {
    cb(new Error('The Device must be connected'));

    return;
  }

  this.sp.write(what, cb);
};

/**
 * Describes the conjunction of machines to
 * search for.
 */
function Machines (sigTerm) {
  this.sigTerm = sigTerm || 'grbl';
}

/**
 * Searches for valid devices that are connected
 * @param  {Function} onValidDeviceFound
 * callback function to be resolved with
 * (err|Device) when a valid device is found
 */
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

/**
 * Verifies if the device passed to it is valid
 * (given a signature).
 * @param  {obj}  device info about the device
 * @return {Boolean}        true|false
 */
Machines.prototype.isValidDevice = function (device) {
  if (!device.info ||
      !~device.info.signature.toLowerCase().indexOf(this.sigTerm))
    return false;
  return true;
};


module.exports = {
  Device: Device,
  Machines: Machines
};
