'use strict';

function Grbl (dev, RX_BUFFER_SIZE) {
  this.dev = dev;
  this.RX_BUFFER_SIZE = RX_BUFFER_SIZE || 128;
  this.queue = [];
  this.gCount = 0;
}

Grbl.prototype.process = function (line) {
  if (line)
    this._enqueue(line);

  if (!this.queue.length)
    return;

  // while we have the possibility of sending data
  while (this.queue.length &&
         this.queue[0].length + this.gCount < this.RX_BUFFER_SIZE) {

    var line = this.queue.shift();

    this.dev.write(line, function (err) {
      if (!err)
        this.gCount += line.length;
    }.bind(this));
  }
};

Grbl.prototype._enqueue = function (line) {
  if (line.length >= this.RX_BUFFER_SIZE)
    throw new Error('Line\'s length must be less than RX_BUFFER_SIZE');

  this.queue.push(line.trim());
};

Grbl.prototype.init = function () {
  this.dev.on('data', function (data) {
    if (data === 'ok')
      this.process();
  }.bind(this));
};

module.exports = Grbl;
