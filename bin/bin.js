#!/usr/bin/env node

var yaspm = require('../index')
	,	machines = new yaspm.Machines();

machines.search(function (err, device) {
	if (err) throw err;

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
