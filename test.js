var ctx = require('./index');

var app = ctx();

app.on('$value', function(name, value) {
  console.log(name, value);
});

app
  .define('a', [], function() { return 7; })
  .define('b', [], function() { return 3; })
  .define('c', [ 'a', 'b' ], function() { return this.a * this.b; })
  .define('d', [], function() { return 2; })
  .define('e', [ 'c', 'd' ], function() { return this.c * this.d; })
;

app.resolve(function(values) {
  console.log(values);
});

