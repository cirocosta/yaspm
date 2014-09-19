'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;


function FakeDevice (info) {
  if (!(this instanceof FakeDevice))
    return new FakeDevice(info);

  this.info = info;
  this._open = false;
  EventEmitter.call(this);

  return this;
};

inherits(FakeDevice, EventEmitter);


FakeDevice.prototype._getMs = function () {
  return Math.random() * 300 | 0;
};

FakeDevice.prototype.connect = function () {
  setTimeout(function () {
    this._open = true;
    this.emit('connect', {});

  }.bind(this), this._getMs());

  return this;
};

FakeDevice.prototype.write = function (line, cb) {
  if (!this._open)
    cb(new Error('Device must be connected to write.'));

  setTimeout(function () {
    this.emit('data', 'ok');
  }.bind(this), this._getMs());

  return this;
};

FakeDevice.prototype.disconnect = function() {
  this._open = false;
};

module.exports = FakeDevice;
