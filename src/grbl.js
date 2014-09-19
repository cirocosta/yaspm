'use strict';

function grbl (dev) {
  var RX_BUFFER_SIZE = 128;
  var queue = [];
  var gCount = 0;

  function _sum (lines) {
    return lines.reduce(function (sum, curr) {
      return sum + curr;
    }, 0);
  }

  function _send () {
    if (!queue.length)
      return;

    while (queue[0].length + gCount < RX_BUFFER_SIZE) {
      var line = queue.shift();

      gCount += line.length;
      dev.write();
    }
  }

  dev.on('data', function (data) {
    if (data === 'ok')
      send();
  });

  function write (line) {
    queue.push(line.trim());
  }

  function flush () {
    _send();

    return queue;
  }

  return {
    write: write,
    flush: flush
  };
}

module.exports = grbl;
