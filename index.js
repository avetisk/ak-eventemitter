'use strict';

/**
 * Export `EventEmitter`
 *
 * @param {Object} config (optional)
 * @return {EventEmitter}
 */
var EventEmitter = module.exports = function (config) {
  this.tree = {'children': {}};
  this.delimiter = (config || {}).delimiter || '.';
};

/**
 * Call all callbacks for given tree
 *
 * @see #_searchTree();
 *
 * @param {Object} tree
 * @param {arguments} args
 */
EventEmitter.prototype._emit = function (tree, args) {
  var callbacks = tree.callbacks;

  if (! callbacks) {
    return this;
  }

  var argc = args.length;

  for (
    var i = 0,
    len = callbacks.length,
    callback;
    i < len;
    i += 1
  ) {
    callback = callbacks[i];

    if (argc === 1) {
      callback.fn.call(callback.context, args[0]);
    } else if (argc === 2) {
      callback.fn.call(callback.context, args[0], args[1]);
    } else {
      callback.fn.apply(callback.context, args);
    }

    if (callback.once) {
      callbacks.splice(i, 1);

      if (callbacks.length === 0) {
        tree.callbacks = undefined;
      }
    }
  }
};

/**
 * Parse given tree for given ns
 *
 * @see #emit();
 *
 * @param {Object} tree
 * @param {Array} ns
 * @param {Integer} start
 * @param {arguments} args
 */
EventEmitter.prototype._searchTree = function (tree, ns, start, args) {
  for (var i = start,
    len = ns.length,
    currentNs,
    currentTree,
    wildTree;
    i < len;
    i += 1
  ) {
    if (wildTree = tree.children['*']) {
      if (wildTree.callbacks) {
        this._emit(wildTree, args);
      }

      this._searchTree(wildTree, ns, i + 1, args);
    }

    currentNs = ns[i];
    currentTree = tree.children[currentNs];

    if (! currentTree) {
      return this;
    }

    tree = currentTree;
  }

  if (currentTree) {
    this._emit(currentTree, args);
  }
};

/**
 * Add event listener
 *
 * @param {String} ns
 * @param {Function} callback
 * @param {Object} options (optional)
 * @return {EventEmitter}
 */
EventEmitter.prototype.on = function (ns, callback, options) {
  ns = ns.split(this.delimiter);
  var tree = this.tree;
  var currentNs;
  var currentTree;

  for (var i = 0, len = ns.length; i < len; i += 1) {
    currentNs = ns[i];

    if (! (currentTree = tree.children[currentNs])) {
      currentTree = tree.children[currentNs] = {'children': {}};
    }

    tree = currentTree;
  }

  if (! tree.callbacks) {
    tree.callbacks = [];
  }

  tree.callbacks.push({
    'fn': callback,
    'context': ! options || ! options.context ? this : options.context,
    'once': !! (options && options.once)
  });

  return this;
};

/**
 * Remove event listener
 *
 * @param {String} ns
 * @param {Function} callback
 * @param {Object} options (optional)
 * @return {EventEmitter}
 */
EventEmitter.prototype.off = function (ns, callback, options) {
  if (! ns) {
    this.tree = {'children': {}};

    return this;
  }

  ns = ns.split(this.delimiter);
  var tree = this.tree;
  var currentNs;
  var currentTree;

  for (var i = 0, len = ns.length; i < len; i += 1) {
    currentNs = ns[i];

    if (! (currentTree = tree.children[currentNs])) {
      return this;
    }

    tree = currentTree;
  }

  if (! callback) {
    tree.callbacks = undefined;

    return this;
  }

  if (! tree.callbacks) {
    return this;
  }

  for (
    var i2 = 0,
    callbacks = tree.callbacks,
    len2 = callbacks.length,
    currentCallback;
    i2 < len2;
    i2 += 1
  ) {
    currentCallback = callbacks[i2];

    if (currentCallback.fn === callback) {
      if (options && options.context && options.context !== currentCallback.context) {
        continue;
      }

      callbacks[i2].splice(i2, 1);

      break;
    }
  }

  if (! callbacks.length) {
    tree.callbacks = undefined;
  }

  return this;
};

/**
 * Emit event
 *
 * @param {String} ns
 * @param {*} ... (optional)
 * @return {EventEmitter}
 */
EventEmitter.prototype.emit = function (ns) {
  ns = ns.split(this.delimiter);

  this._searchTree(this.tree, ns, 0, arguments);

  return this;
};

/**
 * Add event listener for once
 *
 * @param {String} ns
 * @param {Function} callback
 * @param {Object} options (optional)
 * @return {EventEmitter}
 */
EventEmitter.prototype.once = function (ns, callback, options) {
  options = options ? options : {};
  options.once = true;

  this.on(ns, callback, options);

  return this;
};
