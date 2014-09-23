#!/usr/bin/env node

var yaspm = require('../index');
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

function handleConnect (device) {
  console.log('device connected!');
  console.log(device);
}

function handleDisconnect (device) {
  console.log('device disconnected :(');
}
