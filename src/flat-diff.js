'use strict';

var _ = require('lodash');

function diff (a0, a1) {
  if (!a1)
    throw new Error('diff expectes two arrays');

  return {
    insertions: _.compact(_.difference(a1, a0)),
    deletions: _.compact(_.difference(a0, a1))
  };
};

module.exports = diff;
