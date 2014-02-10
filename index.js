function params(f) {
  var decl = f.toString();
  return decl.slice(decl.indexOf('(') + 1, decl.indexOf(')')).match(/([^\s,]+)/g) || [];
}

function proj(x) {
  return this[x];
}

var defs = {};
var values = {};
var pending = 0;
var cb = null;

var define = function (name, factory) {
  var dependencies = params(factory);

  var async = dependencies[dependencies.length - 1] == 'done';
  if (async) dependencies.pop();

  defs[name] = {
    name: name,
    factory: factory,
    waiting: [],
    dependencies: dependencies,
    pending: dependencies.length,
    async: async
  }

  pending++;
};

var end = function (err) {
  var _cb = cb;
  cb = defs = values = null;
  _cb();
};

var eval = function (def) {
  var done = function (err, value) {
    if (err) return end(err);
    if (--pending == 0) return end(null);

    values[def.name] = value;

    def.waiting.forEach(function (name) {
      var waiting = defs[name];
      if (--waiting.pending == 0) eval(waiting);
    });
  };

  var args = def.dependencies.map(proj, values);

  if (def.async) {
    args.push(done);
    def.factory.apply(null, args);
  } else {
    done(null, def.factory.apply(null, args));
  }
};

var resolve = function (done) {
  cb = done;

  for (var name in defs) {
    var def = defs[name];
    def.dependencies.forEach(function (dep) {
      var d = defs[dep];
      if (d) {
        d.waiting.push(name);
      } else {
        throw new Error(name + ' depends on ' + dep + ' which does not exist');
      }
    });
  };

  var todo = [];
  for (var name in defs) {
    var def = defs[name];
    if (def.pending == 0) todo.push(def);
  };
  todo.forEach(eval);
};

module.exports = {
  define: define,
  resolve: resolve
};

