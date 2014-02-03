var assert = require('assert');

var ctx = require('./index');

ctx.define('a', function () { return 7; });
ctx.define('b', function () { return 3; });
ctx.define('c', function (a, b) { return a * b; });
ctx.define('d', function () { return 2; });
ctx.define('e', function (c, d, done) { return done(null, c * d); });
ctx.define('test', function (a, b, c, d, e) {
  assert.equal(a, 7);
  assert.equal(b, 3);
  assert.equal(c, 21);
  assert.equal(d, 2);
  assert.equal(e, 42);
  console.log('OK');
});

ctx.resolve(function (err) {
  console.log('errors', err);
});

