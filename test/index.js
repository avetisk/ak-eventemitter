/*global describe, it*/

'use strict';

var assert = require('assert');
var EventEmitter = require('../');

describe('EventEmitter', function () {
  // #on() and #emit()
  describe('#on() and #emit()', function () {
    it('ON: hari, bol, EMIT: hari, bol', function (done) {
      var emitter = new EventEmitter();
      var counter = 0;
      emitter.on('hari', function (ns, a, b, c) {
        assert.equal(arguments.length, 4);
        assert.equal(ns, 'hari');
        assert.equal(a, 12);
        assert.equal(b, 34);
        assert.equal(c, 56);

        counter += 1;
      });
      emitter.on('bol', function () {
        if (counter) {
          done();
        }
      });
      emitter.emit('hari', 12, 34, 56);
      emitter.emit('bol');
      emitter.emit('govinda');
      emitter.emit('hari.bol');
    });
    it('ON: hari.bol, EMIT: hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.bol', function () {
        done();
      });
      emitter.emit('hari.bol');
    });
    it('ON: hari.bol, EMIT: hari.hari, hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.bol', function () {
        done();
      });
      emitter.emit('hari.hari');
      emitter.emit('hari.bol');
    });
    it('ON: hari.*, EMIT: hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.*', function () {
        done();
      });
      emitter.emit('hari.bol');
    });
    it('ON: hari.*, EMIT: hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.*', function () {
        done();
      });
      emitter.emit('hari.bol');
    });
    it('ON: hari.*, EMIT: bolo.hari, hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.*', function () {
        done();
      });
      emitter.emit('bolo.hari');
      emitter.emit('hari.bol');
    });
    it('ON: hari.*.bol, EMIT: hari.hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.*.bol', function () {
        done();
      });
      emitter.emit('hari.hari.bol');
      emitter.emit('hari.bol');
    });
    it('ON: hari.*.bol, EMIT: hari.hari.hari, hari.hari.bol', function (done) {
      var emitter = new EventEmitter();
      emitter.on('hari.*.bol', function () {
        done();
      });
      emitter.emit('hari.hari.hari');
      emitter.emit('hari.hari.bol');
    });
    it('ON: hari.*.bol, EMIT: hari.bol.bol, hari.hari.bol', function (done) {
      var emitter = new EventEmitter();
      var counter = 0;
      emitter.on('hari.*.bol', function (ns, a, b, c) {
        if (counter) {
          assert.equal(arguments.length, 3);
          assert.equal(ns, 'hari.hari.bol');
          assert.equal(a, 123);
          assert.equal(b, 456);
          assert.equal(c, undefined);

          done();
        } else {
          assert.equal(arguments.length, 4);
          assert.equal(ns, 'hari.bol.bol');
          assert.equal(a, 12);
          assert.equal(b, 34);
          assert.equal(c, 56);

          counter += 1;
        }
      });
      emitter.emit('hari.bol.bol', 12, 34, 56);
      emitter.emit('hari.hari.bol', 123, 456);
    });
    it('ON: hari.bol, hari.*, EMIT: hari.bol, hari.hari.bol', function (done) {
      var emitter = new EventEmitter();
      var counter = 0;
      emitter.on('hari.bol', function () {
        counter += 1;

        // NOTE wildcards are parsed first
        if (counter > 2) {
          throw new Error('should be called only once');
        }
      });
      emitter.on('hari.*', function () {
        counter += 1;

        if (counter === 3) {
          done();
        }
      });
      emitter.emit('hari.bol');
      emitter.emit('hari.hari.bol');
    });
  });

  // #once()
  describe('#once()', function () {
    it('ONCE: hari.*, EMIT: hari.bol, hari.hari', function (done) {
      var emitter = new EventEmitter();
      emitter.once('hari.*', function () {
        done();
      });
      emitter.emit('hari.bol');
      emitter.emit('hari.hari');
    });
  });

  // #off()
  describe('#off()', function () {
    it('ON: hari.*, EMIT hari.bol, OFF: hari.*, EMIT: hari.hari', function (done) {
      var emitter = new EventEmitter();
      emitter.once('hari.*', function () {
        done();
      });
      emitter.emit('hari.bol');
      emitter.off('hari.*');
      emitter.emit('hari.hari');
    });
    it('ON: hari.*, EMIT: hari.bol, OFF, EMIT: hari.hari', function (done) {
      var emitter = new EventEmitter();
      emitter.once('hari.*', function () {
        done();
      });
      emitter.emit('hari.bol');
      emitter.off();
      emitter.emit('hari.hari');
    });
  });
});
