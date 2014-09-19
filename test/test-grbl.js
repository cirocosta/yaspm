'use strict';

var assert = require('assert');
var Grbl = require('../src/grbl');
var FakeDevice = require('../src/fake-device');


describe('grbl', function () {
  it('be defined', function() {
    assert(!!Grbl);
    assert(!!FakeDevice);
  });

  var device;
  var grbl;

  beforeEach(function () {
    device = new FakeDevice();
  });

  describe('write', function() {
    it('should be able to write anything < RX_BUFFER if first write', function (done) {
      device.connect();
      device.on('connect', function () {
        grbl = new Grbl(device);

        grbl.init();
        grbl.process('something');

        assert(true);
        done();
      });
    });

    it('should throw if line length > RX_BUFFER', function (done) {
      device.connect();
      device.on('connect', function () {
        grbl = new Grbl(device);

        grbl.init();

        assert.throws(function () {
          grbl.process('RX_BUFFERRX_BUFFERRX_BUFFERRX_BUFFERRX_BUFFERRX_BUF' +
                       'RX_BUFFERRX_BUFFERRX_BUFFERRX_BUFFERRX_BUFFERRX_BUFF' +
                       'ERRX_BUFFERRX_BUFFERRX_BUFFERsomething bigger then ' +
                       'the line length of RX_BUFFERRX_BUFFERRX_BUFFERRX_BU' +
                       'FFERRX_BUFFERRX_BUFFERRX_BUFFERRX_BUFFERRX_BUFFER');
        });
        done();
      });
    });

    it('process should process based on flow control what to send', function (done) {
      device.connect();
      device.on('connect', function () {
        grbl = new Grbl(device, 15);

        grbl.init();
        grbl.process('something1');
        grbl.process('something2');

        assert.equal(grbl.queue.length, 0);
        done();
      });
    });
  });
});
