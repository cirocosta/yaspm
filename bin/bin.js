#!/usr/bin/env node

var Machines = require('../index').Machines();

Machines
  .search()
  .on('validdevice', function (device) {
    device
      .connect()
      .on('connect', handleConnect.bind(null, device))
      .on('data', handleData.bind(null, device))
      .on('disconnect', handleDisconnect.bind(null, device));
  })
  .on('removeddevice', function (pnpId) {
    console.log('Just removed: ' + pnpId);
  });


var tmr;

function handleConnect (device) {
  console.log('device connected!');
  console.log(device.getInfo());

  tmr = setInterval(function () {
    device.write('?\n');
  }, 1000);
}

function handleData (device, data) {
  console.log(data);
}

function handleDisconnect (device) {
  console.log('device disconnected :(');
  console.log(device.getInfo());

  clearInterval(tmr);
}
