var util = require('util'),
    EventEmitter = require('events').EventEmitter;

function Ctx() {
  EventEmitter.call(this);

  this.pendings = 0;

  this.setMaxListeners(0);
}
util.inherits(Ctx, EventEmitter);

Ctx.prototype.define = function(name, dependencies, factory) { 
  var self = this;

  self.pendings++;

  var pendings = dependencies.length + 1;

  var done = function(product) {
    self.provide(name, product);
  };

  var solve = function() {
    if (--pendings == 0) {
      if (factory.length == 0) {
        done(factory.call(self));
      } else {
        factory.call(self, done);
      }
    }
  };

  var listen = function(dependency) {
    self.once(dependency, solve);
  };

  listen('@');
  dependencies.forEach(listen);

  return self;
};

Ctx.prototype.provide = function(name, value) {
  this[name] = value;
  this.emit('$binding', name, value);
  this.emit(name);
  if (--(this.pendings) == 0) {
    if (this.done) {
      this.done(this);
    }
  }
};

Ctx.prototype.resolve = function(done) {
  this.done = done;
  this.emit('@');
};

module.exports = function() {
  return new Ctx();
};

