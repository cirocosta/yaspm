#!/usr/bin/env node

var Machines = require('../index').Machines();

Machines
  .search()
  .on('validdevice', function (device) {
    console.log('device found: ' + device.pnpId);
  })
  .on('removeddevice', function (pnpId) {
    console.log('Just remoded: ' + pnpId);
  });


// Machines()
//   .search()
//   .on('validdevice', function (device) {

//     device
//       .connect()
//       .on('connected', function () {

//       });
//       .on('data', function (data) {
//         console.log(data);
//       })
//       .on('disconnect', function () {

//       });
//   });
