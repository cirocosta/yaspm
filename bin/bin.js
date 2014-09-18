#!/usr/bin/env node

var Machines = require('../index').Machines;


Machines()
  .search()
  .on('validdevice', function (device) {

    device
      .connect()
      .on('connected', function () {

      });
      .on('data', function (data) {
        console.log(data);
      });


    device.connect(function () {
      device.registerToData(function (e, d) {
        e || console.log(d);
      });

      setInterval(function () {
        device.write('?\n', function (e) {
          if (e) throw e;
        });
      }, 300);
    });
  });
