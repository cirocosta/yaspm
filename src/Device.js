'use strict';

var split = require('split');
var serialport = require('serialport');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;


/**
 * Represents a valid Device.
 * @param {obj} device the info about the device
 * @param {obj} sp     serialport object
 */
function Device (device, sp) {
  for (var i in device)
    this[i] = device[i];

  this._open = false;
  this._sp = sp;
}

inherits(Device, EventEmitter);

/**
 * Returns information about the device.
 * @return {Object}
 */
Device.prototype.getInfo = function () {
  return _.pick(this, function (key) {
    return key != null ? key[0] != '_' : false;
  });
};

/**
 * Tries to connect to the device.
 */
Device.prototype.connect = function () {
  var sp = new serialport.SerialPort(this.comName);
  var scope = this;

  sp.on('open', function () {
    scope._open = true;

    process.nextTick(function () {
      scope.emit('connect');
    });
  });

  sp
    .pipe(split())
    .on('data', scope.emit.bind(this, 'data'));

  sp.on('close', function () {
    console.log('close');

    scope._open = false;
    scope.emit('disconnect');
  });

  sp.on('error', function () {
    scope.emit('error');
  });

  sp.on('error', scope.emit.bind(this, 'error'));

  return (scope._sp = sp, this);
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
