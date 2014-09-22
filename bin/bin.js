#!/usr/bin/env node

var yaspm = require('../index');
var Grbl = yaspm.Grbl;
var Machines = yaspm.Machines();


Machines
  .search()
  .on('validdevice', function (device) {
    device
      .connect()
      .on('connect', handleConnect.bind(null, device))
      .on('disconnect', handleDisconnect.bind(null, device));
  })
  .on('removeddevice', function (pnpId) {
    console.log('Just removed: ' + pnpId);
  });


var tmr;

function handleConnect (device) {
  console.log('device connected!');

  var grbl = new Grbl(device);
  grbl.init();

  grbl.on('status', function (status) {
    console.log(status);
  });

  grbl.on('error', function (err) {
    console.log(err);
  });

  grbl.on('ok', function () {
    console.log('ok');
  });

  setTimeout(function () {
    grbl.process('G1 X10 Y10\n');
  }, 300);

  tmr = setInterval(function () {
    grbl.process('?\n');
  }, 300);
}

function handleDisconnect (device) {
  console.log('device disconnected :(');
  console.log(device.getInfo());

  clearInterval(tmr);
}
