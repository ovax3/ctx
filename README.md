# ctx

`ctx` is a minimalist context resolver.

# install

    npm install ctx

# example

    var ctx = require('ctx');

    ctx()
      .define('a', [], function() { return 7; })
      .define('b', [], function() { return 3; })
      .define('c', [ 'a', 'b' ], function() { return this.a * this.b; })
      .define('d', [], function() { return 2; })
      .define('e', [ 'c', 'd' ], function() { return this.c * this.d; })
    .resolve(function(values) {
      console.log(values);
    });

results in

    { a: 7, b: 3, c: 21, d: 2, e: 42 }

