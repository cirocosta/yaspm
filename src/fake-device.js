'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;


function FakeDevice (info) {
  if (!(this instanceof FakeDevice))
    return new FakeDevice(info);

  this.info = info;
  EventEmitter.call(this);

  return this;
};

inherits(FakeDevice, EventEmitter);

FakeDevice.prototype._getMs = function () {
  return Math.random() * 500 | 0;
};

FakeDevice.prototype.connect = function () {
  setTimeout(function () {
    this.emit('connect', {});

  }.bind(this), this._getMs());

  return this;
};

FakeDevice.prototype.write = function () {
  setTimeout(function () {
    this.emit('data', 'ok');
  }.bind(this), this._getMs());

  return this;
};

module.exports = FakeDevice;
