var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function params(f) {
  var decl = f.toString();
  return decl.slice(decl.indexOf('(') + 1, decl.indexOf(')')).match(/([^\s,]+)/g) || [];
}

function proj(x) {
  return this[x];
}

function Ctx() {
  EventEmitter.call(this);

  this.pendings = 0;
  this.errors = {};

  this.setMaxListeners(0);
}
util.inherits(Ctx, EventEmitter);

Ctx.prototype.define = function (name, factory) {
  var self = this;

  var dependencies = params(factory);

  var async = dependencies[dependencies.length - 1] == 'done';
  if (async) dependencies.pop();

  self.pendings++;

  var pendings = dependencies.length + 1;

  var done = function (err, product) {
    self.provide(name, err, product);
  };

  var ecount = 0;

  var solve = function (_, err, _) {
    if (err) ecount++;

    if (--pendings == 0) {
      if (ecount !== 0) {
        return done(new Error(ecount + " dependencies in error"));
      }

      var args = dependencies.map(proj, self);

      if (async) {
        args.push(done);
        return factory.apply(self, args);
      } else {
        return done(null, factory.apply(self, args));
      }
    }
  };

  var listen = function (dependency) {
    self.once(dependency, solve);
  };

  listen('@');
  dependencies.forEach(listen);
};

Ctx.prototype.provide = function (name, err, value) {
  if (err) this.errors[name] = err;
  this[name] = value;
  this.emit('$binding', name, err, value);
  this.emit(name, name, err, value);
  if (--(this.pendings) == 0) {
    if (this.done) {
      var ecount = Object.getOwnPropertyNames(this.errors).length;
      this.done(ecount === 0 ? null : this.errors, this);
    }
  }
};

Ctx.prototype.resolve = function (done) {
  this.done = done;
  this.emit('@');
};

module.exports = function () {
  return new Ctx();
};

