var ctx = require('./index');

var $ = ctx();

$.on('$binding', function(name, value) {
  console.log(name, value);
});

$
  .define('a', [], function() { return 7; })
  .define('b', [], function() { return 3; })
  .define('c', [ 'a', 'b' ], function() { return $.a * $.b; })
  .define('d', [], function() { return 2; })
  .define('e', [ 'c', 'd' ], function() { return $.c * $.d; })
;

$.resolve(function() {
  console.log($.a, $.b, $.c, $.d, $.e);
});

