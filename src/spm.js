'use strict';

var SerialPort = require('serialport').SerialPort;

/**
 * Main function to be exported. It exposes a
 * better serialport.
 * @param  {[type]}   comName the comName
 *                            returned from the
 *                            port listing
 * @param  {Function} fn      callback function
 *                            to be called with
 *                            (err|sp|signature)
 */
function enhanceSpm (comName, checkSignature, fn) {
  var sp = new SerialPort(comName)
    , open = false;

  sp.writable = true;
  sp.on('open', function() {
    open = true;
    if (checkSignature)
      getSignature(sp, function(e, sig) {
        fn(e, sp, sig);
      });
    else
      fn(null, sp, null);
  });

  sp.once('error', function(e) {
    console.log('ERROR', e, comName);
    if (!open)
      fn(e);
  });
}

/**
 * Given a SerialPort obj, tries to get the
 * signature emitted from the device.
 * @param  {Object}   sp sp
 * @param  {Function} fn callback fn. Resolves
 *                       with (err | serialport |
 *                       signature) when ready.
 */
function getSignature (sp, fn) {
  var start = null
    , sig = ''
    , timer;

  var handleSignature = function(data) {
    if (data)
      sig += data.toString() || '';

    clearTimeout(timer);

    if (!start && data) {
      start = Date.now();
    } else if (Date.now() - start > 100) {
      sp.removeListener('data', handleSignature);
      return fn(null, sig.trim());
    }

    timer = setTimeout(handleSignature, 100);
  };

  sp.on('data', handleSignature);
}


module.exports = enhanceSpm;
