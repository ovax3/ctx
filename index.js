var EventEmitter = require('events').EventEmitter;

function params(f) {
  var decl = f.toString();
  return decl.slice(decl.indexOf('(') + 1, decl.indexOf(')')).match(/([^\s,]+)/g) || [];
}

function proj(x) {
  return this[x];
}

var emitter = new EventEmitter();
emitter.setMaxListeners(0);

var pendings = 0;
var errors = {};
var values = {};

var provide = function (name, err, value) {
  if (err) errors[name] = err;
  values[name] = value;
  emitter.emit('$binding', name, err, value);
  emitter.emit(name, name, err, value);
  if (--pendings == 0) {
    if (values.done) {
      var ecount = Object.getOwnPropertyNames(errors).length;
      values.done(ecount === 0 ? null : errors, values);
    }
  }
};

var define = function (name, factory) {
  var dependencies = params(factory);

  var async = dependencies[dependencies.length - 1] == 'done';
  if (async) dependencies.pop();

  pendings++;

  var _pendings = dependencies.length + 1;

  var done = function (err, product) {
    provide(name, err, product);
  };

  var ecount = 0;

  var solve = function (_, err, _) {
    if (err) ecount++;

    if (--_pendings == 0) {
      if (ecount !== 0) {
        return done(new Error(ecount + " dependencies in error"));
      }

      var args = dependencies.map(proj, values);

      if (async) {
        args.push(done);
        return factory.apply(values, args);
      } else {
        return done(null, factory.apply(values, args));
      }
    }
  };

  var listen = function (dependency) {
    emitter.once(dependency, solve);
  };

  listen('@');
  dependencies.forEach(listen);
};

var resolve = function (done) {
  emitter.emit('@');
};

module.exports = {
  define: define,
  resolve: resolve
};

