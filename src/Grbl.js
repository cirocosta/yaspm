'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var MATCHER = /(error|ok|\$|<)/i;

/**
 * Constructor for GRBL device proxy
 * @param {Device} dev            the device
 * that grbl will proxy
 * @param {number} RX_BUFFER_SIZE read buffer
 * size
 */
function Grbl (dev, RX_BUFFER_SIZE) {
  this.dev = dev;
  this.RX_BUFFER_SIZE = RX_BUFFER_SIZE || 128;
  this.sendQueue = [];
  this.sentQueue = [];
  this.gCount = 0;

  EventEmitter.call(this);
}

inherits(Grbl, EventEmitter);

/**
 * Process the line - queues it and then if
 * possible sends to grbl's arduino serial read
 * buffer.
 * @param  {string} line
 */
Grbl.prototype.process = function (line) {

  if (line)
    this._enqueue(line);

  if (!this.sendQueue.length)
    return;

  console.log(this.gCount);

  // while we have the possibility of sending data
  while (this.sendQueue.length &&
         this.sendQueue[0].length + this.gCount < this.RX_BUFFER_SIZE) {

    var line = this.sendQueue.shift();

    this.sentQueue.push(line);
    this.dev.write(line, function (err) {
      if (!err) {
        if (line.match(/\?\\n/g))
          return;

        this.gCount += line.length;
      }
    }.bind(this));
  }
};

/**
 * Adds a line to the queue, if possible to do
 * so.
 * @internal
 * @param  {string} line
 */
Grbl.prototype._enqueue = function (line) {
  if (line.length >= this.RX_BUFFER_SIZE)
    throw new Error('Line\'s length must be less than RX_BUFFER_SIZE');

  this.sendQueue.push(line);
};

/**
 * Initializes GRBL proxy. Not on constructor as
 * this might produce collateral effects.
 */
Grbl.prototype.init = function () {
  this.dev.on('data', function (data) {
    this.interpret(data);
  }.bind(this));
};

/**
 * Interprets the results that are comming from
 * the grbl.
 * @param  {string} data
 */
Grbl.prototype.interpret = function (data) {
  var matches = data.match(MATCHER);

  if (!matches)
    return;

  switch (matches[0]) {
    case 'ok':
      this.emit('ok', {});
      this.gCount -= (this.sentQueue.shift()).length;
      this.process();
    break;

    case 'error':
      this.emit('error', data);
    break;

    case '$':
      this.emit('config', data);
    break;

    case '<':
      var parts = data.replace(/\<|\>/g, '').split(',');
      var status = {
        status : parts.shift().toLowerCase(),
        position: {
          machine : {
            x : +(parts.shift().replace(/^[a-z:]+/gi,'')),
            y : +(parts.shift()),
            z : +(parts.shift()),
          },
          work : {
            x : +(parts.shift().replace(/^[a-z:]+/gi,'')),
            y : +(parts.shift()),
            z : +(parts.shift()),
          }
        }
      };

      this.emit('status', status);
    break;
  }
};

module.exports = Grbl;


// error:Expected command letter
// error:Bad number format
// error:Invalid statement
// error:Setting disabled
// error:Value < 3 usec
// error:EEPROM read fail. Using defaults
// error:Not idle
// error:Alarm lock`
// error:Homing not enabled
// error:Line overflow
// error:Modal group violation
// error:Unsupported command
// error:Undefined feed rate
// error:Invalid gcode ID:XX
