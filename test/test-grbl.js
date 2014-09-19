'use strict';

var assert = require('assert');
var grbl = require('../src/grbl');
var FakeDevice = require('../src/fake-device');

describe('grbl', function () {
  it('be defined', function() {
    assert(!!grbl);
    assert(!!FakeDevice);
  });

  var device;
  var dev;

  beforeEach(function () {
    device = new FakeDevice();
    // dev = grbl(dev);
  });

  describe('write', function() {
    it('description', function() {
      device.on('data', function () {
        console.log('hadsiudsha');
      });

      console.log(device);
    });
  });
});
