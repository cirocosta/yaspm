'use strict';

var split = require('split');
var serialport = require('serialport');

/**
 * Represents a valid Device.
 * @param {obj} device the info about the device
 * @param {obj} sp     serialport object
 */
function Device (device, sp) {
  this._info = device;
  this._open = false;
  this._sp = sp;
}

/**
 * Returns information about the device.
 * @return {Object}
 */
Device.prototype.getInfo = function () {
  return this._info;
};

/**
 * Tries to connect to the device.
 * @param  {Function} ocb callback function for
 *                        the open event
 * @param  {Function} ccb callback function for
 *                        the close event
 */
Device.prototype.connect = function(ocb, ccb) {
  var sp = new serialport.SerialPort(this._info.comName);

  sp.on('open', function () {
    this._open = true;
    ocb();
  }.bind(this));

  sp.on('close', function () {
    this._open = false;
    ccb();
  }.bind(this));

  this._sp = sp;
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
  if (!this._open) {
    cb(new Error('The device must be connected'));

    return;
  }

  this._sp.pipe(split()).on('data', function (data) {
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
  if (!this._open) {
    cb(new Error('The Device must be connected'));

    return;
  }

  this._sp.write(what, cb);
};


module.exports = Device;
