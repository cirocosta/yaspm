/**
 * Main function to be exported. It exposes a better serialport.
 * @param  {[type]}   comName the comName returned from the port
 *                            listing
 * @param  {Function} fn      callback function to be called with
 *                            (err|sp|signature)
 */
function Spm (comName, fn) {
  'use strict';

  var SerialPort = require('serialport').SerialPort
    , sp = new SerialPort(comName)
    , open = false;

  var getSignature = function(sp, fn) {
    var start = null
      , sig = ''
      , timer;

    var handleSignature = function(data) {
      if (data) {
        sig += data.toString() || '';
      }

      clearTimeout(timer);

      if (start === null && data) {
        start = Date.now();
      } else if (Date.now() - start > 100) {
        sp.removeListener('data', handleSignature);
        return fn(null, sig.trim());
      }
      timer = setTimeout(handleSignature, 100);
    };

    sp.on('data', handleSignature);
  };

  sp.writable = true;

  sp.on('open', function() {
    open = true;
    getSignature(sp, function(e, sig) {
      fn(e, sp, sig);
    });
  });

  sp.once('error', function(e) {
    console.log('ERROR', e, comName);
    if (!open)
      fn(e);
  });
}

module.exports = Spm;
