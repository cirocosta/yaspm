#!/usr/bin/env node

var yaspm = require('../index');
var Machines = yaspm.Machines('');
var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

Machines
  .search()
  .on('device', function (device) {
    device
      .connect()
      .on('connect', handleConnect.bind(null, device))
      .on('data', handleData.bind(null, device))
      .on('disconnect', handleDisconnect.bind(null, device));
  })
  .on('removeddevice', function (pnpId) {
    console.log('Just removed: ' + pnpId);
  });

function handleData (device, data) {
  rl.question(data, function (ans) {
    device.write(ans);
  });
}

function handleConnect (device) {
  console.log('device connected!');
}

function handleDisconnect (device) {
  console.log('device disconnected :(');
}
