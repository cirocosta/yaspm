'use strict';

var assert = require('assert');
var FakeDevice = require('../src/fake-device');

describe('grbl', function () {
  it('be defined', function() {
    assert(!!FakeDevice);
  });

  var device;

  beforeEach(function () {
    device = new FakeDevice();
  });

  describe('connect', function () {
    it('emit connect event', function(done) {
      device.connect();
      device.on('connect', function () {
        assert(true);
        done();
      });
    });
  });

  // describe('write', function () {

  // });
});
