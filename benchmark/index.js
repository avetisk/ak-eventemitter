'use strict';

var suite = new (require('benchmark').Suite)();
var EventEmitter1 = require('events').EventEmitter;
var emitter1 = new EventEmitter1();
var EventEmitter3 = require('../');
var emitter3 = new EventEmitter3();
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var emitter2 = new EventEmitter2({
  'wildcard': true,
  'separator': '.'
});

suite
  // simple event
  .add('EM 1 - hari', function () {
    emitter1.on('hari', function () {
      return 1 + 0 + 8;
    });
    emitter1.emit('hari', 1, 2, 3);
    emitter1.removeAllListeners('hari');
  })
  .add('EM 2 - hari', function () {
    emitter2.on('hari', function () {
      return 1 + 0 + 8;
    });
    emitter2.emit('hari', 1, 2, 3);
    emitter2.removeAllListeners('hari');
  })
  .add('EM 3 - hari', function () {
    emitter3.on('hari', function () {
      return 1 + 0 + 8;
    });
    emitter3.emit('hari', 1, 2, 3);
    emitter3.off('hari');
  })
  // one namespace
  .add('EM 2 - hari.bol', function () {
    emitter2.on('hari.bol', function () {
      return 1 + 0 + 8;
    });
    emitter2.emit('hari.bol', 1, 2, 3);
    emitter2.removeAllListeners('hari.bol');
  })
  .add('EM 3 - hari.bol', function () {
    emitter3.on('hari.bol', function () {
      return 1 + 0 + 8;
    });
    emitter3.emit('hari.bol', 1, 2, 3);
    emitter3.off('hari.bol');
  })
  // one wildcard
  .add('EM 2 - hari.*', function () {
    emitter2.on('hari.*', function () {
      return 1 + 0 + 8;
    });
    emitter2.emit('hari.bol', 1, 2, 3);
    emitter2.removeAllListeners('hari.*');
  })
  .add('EM 3 - hari.*', function () {
    emitter3.on('hari.*', function () {
      return 1 + 0 + 8;
    });
    emitter3.emit('hari.bol', 1, 2, 3);
    emitter3.off('hari.*');
  })
  // one wildcard within namespace
  .add('EM 2 - hari.*.bol', function () {
    emitter2.on('hari.*.bol', function () {
      return 1 + 0 + 8;
    });
    emitter2.emit('hari.hari.bol', 1, 2, 3);
    emitter2.removeAllListeners('hari.*.bol');
  })
  .add('EM 3 - hari.*.bol', function () {
    emitter3.on('hari.*.bol', function () {
      return 1 + 0 + 8;
    });
    emitter3.emit('hari.hari.bol', 1, 2, 3);
    emitter3.off('hari.*.bol');
  })
  // altogether
  .add('EM 2 - sum', function () {
    emitter2.on('hari.*.bol', function () {
      return 1 + 0 + 8;
    });
    emitter2.on('hari.*', function () {
      return 1 + 0 + 8;
    });
    emitter2.on('hari.bol', function () {
      return 1 + 0 + 8;
    });
    emitter2.emit('hari.bol', 1, 2, 3);
    emitter2.emit('hari.bol', 1, 2, 3);
    emitter2.emit('hari.hari.bol', 1, 2, 3);
    emitter2.removeAllListeners('hari.bol');
    emitter2.removeAllListeners('hari.*.bol');
    emitter2.removeAllListeners('hari.*');
  })
  .add('EM 3 - sum', function () {
    emitter3.on('hari.*.bol', function () {
      return 1 + 0 + 8;
    });
    emitter3.on('hari.*', function () {
      return 1 + 0 + 8;
    });
    emitter3.on('hari.bol', function () {
      return 1 + 0 + 8;
    });
    emitter3.emit('hari.bol', 1, 2, 3);
    emitter3.emit('hari.bol', 1, 2, 3);
    emitter3.emit('hari.hari.bol', 1, 2, 3);
    emitter3.off('hari.bol');
    emitter3.off('hari.*.bol');
    emitter3.off('hari.*');
  })
  .on('cycle', function (e) {
    console.log(e.target + '');
  })
  .run();
