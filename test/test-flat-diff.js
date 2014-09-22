'use strict';

var diff = require('../src/flat-diff.js');
var assert = require('assert');

describe('diff', function() {
  it('be defined', function() {
    assert(!!diff);
  });

  it('throw if args length < 2', function() {
    assert.throws(function () {
      diff(['a']);
    });
  });

  describe('arrays', function() {
    it('get the right ins', function() {
      var a0 = [];
      var a1 = [1];
      var expected = {insertions: [1], deletions: []};
      var actual = diff(a0, a1);

      assert.deepEqual(actual, expected);
    });

    it('get the right dels', function() {
      var a0 = [1];
      var a1 = [];
      var expected = {insertions: [], deletions: [1]};
      var actual = diff(a0, a1);

      assert.deepEqual(actual, expected);
    });

    it('get the right ins&dels', function() {
      var a0 = [1,2];
      var a1 = [3];
      var expected = {insertions: [3], deletions: [1,2]};
      var actual = diff(a0, a1);

      assert.deepEqual(actual, expected);
    });

    it('empty ins&dels array if no diff', function() {
      var a0 = [1, 2];
      var a1 = [1, 2];
      var expected = {insertions: [], deletions: []};
      var actual = diff(a0, a1);

      assert.deepEqual(actual, expected);
    });
  });
});
