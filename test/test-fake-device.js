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
    it('emit connect event', function (done) {
      device.connect();
      device.on('connect', function () {
        assert(true);
        done();
      });
    });
  });

  describe('disconnect', function () {
    it('disconnect connected device', function() {
      device.connect();
      device.disconnect();

      assert(!device._open);
    });

    it('keep disconnected already disconnected device', function() {
      device.disconnect();

      assert(!device._open);
    });
  });

  describe('write', function () {
    it('be able to write and receive responses if connected', function (done) {
      device.connect();
      device.on('connect', function () {
        device.on('data', function () {
          assert(true);
          done();
        });

        device.write('data');
      });
    });

    it('not be able to write if not connected', function (done) {
      device.write('data', function (err) {
        assert(err);
        done();
      });
    });
  });
});
