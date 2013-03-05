# ctx

`ctx` is a minimalist context resolver.

# install

    npm install ctx

# example

    var ctx = require('ctx');

    var $ = ctx();

    $
      .define('a', [], function() { return 7; })
      .define('b', [], function() { return 3; })
      .define('c', [ 'a', 'b' ], function() { return $.a * $.b; })
      .define('d', [], function() { return 2; })
      .define('e', [ 'c', 'd' ], function() { return $.c * $.d; })
    .resolve(function() {
      console.log($.a, $.b, $.c, $.d, $.e);
    });

results in

    7, 3, 21, 2, 42

