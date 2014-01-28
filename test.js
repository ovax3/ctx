var assert = require('assert');

var ctx = require('./index');

var $ = ctx();

$.on('$binding', function (name, err, value) {
  console.log(name, err, value);
});

$.define('a', function () { return 7; });
$.define('b', function () { return 3; });
$.define('c', function (a, b) { return a * b; });
$.define('d', function () { return 2; });
$.define('e', function (c, d, done) { return done(null, c * d); });
$.define('test', function (a, b, c, d, e) {
  assert.equal(a, 7);
  assert.equal(b, 3);
  assert.equal(c, 21);
  assert.equal(d, 2);
  assert.equal(e, 42);
});

$.resolve(function (err) {
  console.log('errors', err);
});

